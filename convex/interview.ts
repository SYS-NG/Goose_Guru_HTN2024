// convex/interview.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const startInterview = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const interviewId = await ctx.db.insert("interviews", {
      userId: userId,
      status: "ongoing",
      startTime: Date.now(),
    });
    return interviewId;
  },
});

export const getCurrentInterview = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
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