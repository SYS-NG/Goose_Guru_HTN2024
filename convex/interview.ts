// convex/interview.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const startInterview = mutation({
  args: { },
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    const interviewId = await ctx.db.insert("interviews", {
      userId: userId,
      status: "ongoing",
      startTime: Date.now(),
    });
    return interviewId;
  },
});

export const getCurrentInterview = query({
  args: { },
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    const interview = await ctx.db
      .query("interviews")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("status"), "ongoing"))
      .first();
    return interview;
  },
});

export const endInterview = mutation({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, { interviewId }) => {
    await ctx.db.patch(interviewId, {
      status: "completed",
      endTime: Date.now(),
    });
  },
});

export const getInterviewMessages = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, { interviewId }) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("interviewId"), interviewId))
      .order("asc")
      .collect();
  },
});