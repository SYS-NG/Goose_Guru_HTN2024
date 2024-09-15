import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

export const submit = action({
  args: {
    problemId: v.string(), 
    problemQuestion: v.string(), 
    userAns: v.string(), 
    canonicalAns: v.string(), 
  },
  handler: async (ctx, args) => {
    // Prepare the prompt with question data
    const prompt: string = `
      You are a technical interviewer evaluating a candidate's solution in a coding interview. Your task is to judge the candidate's code based on the following aspects:

      1. **Clarity**: How easy is the code to read and understand? Are variable names meaningful? Is the code well-commented and easy to follow?
      2. **Organization**: Is the code structured logically? Are functions and methods used effectively to break the problem into smaller pieces?
      3. **Efficiency**: How optimal is the solution in terms of time and space complexity? Could this solution scale effectively with larger input sizes?
      4. **Elegance**: Are there any clever or elegant aspects of the solution? Did the candidate choose an approach that avoids unnecessary complexity?
      5. **Comparison to the Canonical Solution**: How does this solution compare to a standard or canonical solution for this problem? What does the canonical solution do better, if anything?

      Here is the problem description:
      "${args.problemQuestion}"

      Here is the candidate's solution:
      "${args.userAns}"

      Ignore the function header as that is given by the problem.

      Please provide comprehensive, concrete, and actionable feedback. Identify specific areas where the candidate could improve and suggest how they might do so. Finally, provide a score from 1 to 10, where 10 represents a perfect solution in terms of clarity, organization, efficiency, and comparison to the canonical solution.

      Your response should be detailed, constructive, and helpful to the candidate. Be very strict and critical.
    `

    // Generate a response using Cohere API
    const response: Response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus-08-2024",
        message: prompt,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API request failed: ${response.statusText}`);
    }

    const cohereResponse = await response.json();
    const submissionResponse: string = cohereResponse.text;
    const userId: Id<"users"> | null = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Not signed in");
    }

    console.log(submissionResponse)
    return {
      submissionResponse: submissionResponse
    };
  }
});
