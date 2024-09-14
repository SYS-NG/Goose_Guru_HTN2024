import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { problemId: v.string() },
  handler: async (ctx, args) => { 
    // Grab the specific problem
    const problem = await ctx.db
      .query("codingProblems")
      .filter((q) => q.eq(q.field("problemId"), args.problemId))
      .collect();
    // Add the author's name to each message.
    if (problem === null) {
      throw new Error("The specified problem was not found");
    }
    if ( problem.length > 1) {
      throw new Error("The problem cannot be resolved because more than one problem was found.");
    }
    return problem[0];
  },
});

export const add = mutation({
  args: {
    problemId: v.string(),
    title: v.string(),
    description: v.string(),
    inputFormat: v.string(),
    outputFormat: v.string(),
    sampleInput: v.string(),
    sampleOutput: v.string()
  },
  handler: async (ctx, args) => {
    // Send a new message.
    await ctx.db.insert("codingProblems", { 
      problemId: args.problemId,
      title: args.title,
      description: args.description,
      inputFormat: args.inputFormat,
      outputFormat: args.outputFormat,
      sampleInput: args.sampleInput,
      sampleOutput: args.sampleOutput,
    })
  },
});
