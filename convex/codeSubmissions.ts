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

    const outputStructure = {
      overallFeedback: "string",
      overallScore: "number",
      completeness: {
        feedback: "string",
        score: "number"
      },
      clarity: {
        feedback: "string",
        score: "number"
      },
      organization: {
        feedback: "string",
        score: "number"
      },
      efficiency: {
        feedback: "string",
        score: "number"
      },
      elegance: {
        feedback: "string",
        score: "number"
      },
      areasForImprovement: ["string"]
    };


    // Prepare the prompt with question data
    const prompt: string = `
      You are a technical interviewer assessing a candidate's solution in a coding interview. Your main priority is to evaluate the **completeness** of the code, ensuring that the solution fully addresses the problem requirements and handles edge cases effectively. Additionally, judge the code based on the following criteria:

      1. **Clarity**: Is the code easy to read and understand? Are variable names descriptive and meaningful? Is the logic clear, and is the code sufficiently commented for someone unfamiliar with the problem?
      2. **Organization**: Is the code well-structured? Are functions and methods used appropriately to break the problem into smaller, manageable parts? Is there a clear separation of concerns?
      3. **Efficiency**: How efficient is the solution in terms of time and space complexity? Would the code scale well for larger datasets or more complex inputs?
      4. **Elegance**: Does the candidate use any clever techniques or optimizations? Is the code free of unnecessary complexity, achieving the solution in a simple and direct way?
      5. **completeness**: Is the solution complete and delivers what the question asks
      
      Here is the problem description:
      "${args.problemQuestion}"

      Here is the candidate's solution:
      "${args.userAns}"

      **Note**: You can ignore the function header as that is provided by the problem.

      Please provide detailed, actionable feedback on each of these aspects. Highlight areas where the candidate could improve, with specific suggestions on how to enhance the completeness, clarity, or efficiency of the solution. Finally, give an interview score from 1 to 10, where 10 represents a perfect solution, emphasizing completeness and adherence to best practices.
      Output Structure: ${JSON.stringify(outputStructure, null, 2)}

      Respond only with valid JSON that matches the provided structure.
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
