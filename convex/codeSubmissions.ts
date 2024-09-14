import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { problemId: v.id("codeSubmissions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    // Grab the recent submissions from user for the problem.
    const messages = await ctx.db
      .query("codeSubmissions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("problemId"), args.problemId))
      .order("desc")
      .take(100);
    // Add the author's name to each message.
    return Promise.all(
      messages.map(async (message) => {
        const { name, email } = (await ctx.db.get(message.userId))!;
        return { ...message, author: name ?? email! };
      }),
    );
  },
});

export const submit = mutation({
  args: { problemId: v.string(), code: v.string() },
  handler: async (ctx, args ) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    // Send a new message.
    await ctx.db.insert("codeSubmissions", {
      userId: userId,
      problemId: args.problemId,
      code: args.code,
    });
  },
});
