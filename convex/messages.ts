import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    // Add the author's name to each message.
    return Promise.all(
      messages.map(async (message) => {
        const { name, email } = (await ctx.db.get(message.userId))!;
        return { ...message, author: name ?? email! };
      }),
    );
  },
});

export const send = mutation({
  args: { interviewId: v.id("interviews"), role: v.string(), body: v.string() },
  handler: async (ctx, { interviewId, body, role }) => {
    const userId = await getAuthUserId(ctx);

    /*
      During function testing for audioTranscription:transcribe there is an issue
      adding the transcribed text as a message in the db. I predict it is because of
      testing in the dashboard and I am not "signed in"

      If future issue arises, fastest way might be to get rid of the check. Use simple
      user id instead of auth
    */

    if (userId === null) {
      throw new Error("Not signed in");
    }
    // Send a new message.
    await ctx.db.insert("messages", { body, role, userId, interviewId });
  },
});
