import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { problemId: v.id("codingProblems") },
  handler: async (ctx, args) => { 
    // Grab the specific problem
    const problem = await ctx.db.get( args.problemId );
    // Add the author's name to each message.
    if (problem === null) {
      throw new Error("The specified problem was not found");
    }
    return problem;
  },
});

// export const send = mutation({
//   args: { body: v.string() },
//   handler: async (ctx, { body }) => {
//     // Send a new message.
//     await ctx.db.insert("messages", { body, userId });
//   },
// });
