// convex/interviewerResponse.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

interface Message {
  role: string;
  body: string;
}

interface CohereResponse {
  generations: Array<{
    text: string;
  }>;
}

export const generateResponse = action({
  args: { interviewId: v.id("interviews"), message: v.string(), problemDesc: v.string(), currentCode: v.string()},
  handler: async (ctx, args): Promise<{ interviewResponse: string }> => {
    // Store the user's message
    await ctx.runMutation(api.messages.send, {
      interviewId: args.interviewId,
      role: "user",
      body: args.message,
    });
    
    // Get the chat history
    const chatHistory: Message[] = await ctx.runQuery(api.interview.getInterviewMessages, {
      interviewId: args.interviewId
    });

    // Prepare the prompt with chat history
    const prompt: string = chatHistory
      .map((msg: Message) => `${msg.role}: ${msg.body}`)
      .join("\n") + `\n`;

    // Generate a response using Cohere API
    const response: Response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus-08-2024",
        prompt: `Your name is Emily and you are a human software engineer that works in Big Tech
          You are conducting a coding interview with me. You are friendly and easy going. You love working in tech.
          You like to listen more than you talk.
          Keep your response to 1 - 2 sentences if possible. Your philosophy is that coding is more than about the process than the result.

          Here is the problem for the interviewee to solve: ${args.problemDesc}

          This is the current code from the candidate: ${args.currentCode}
  
          If the candidate does not say anything, don't say anything either unless there was prolonged silence. If nothing has gone one in a while,
          ask what the candidate's thought process is currently.
    
          Here is the response to the most recent prompt given the History: ${prompt}
          Speak in first person as Emily.
        `,
        max_tokens: 200,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API request failed: ${response.statusText}`);
    }

    const cohereResponse: CohereResponse = await response.json();
    const interviewerResponse: string = cohereResponse.generations[0].text.trim();
    const userId: Id<"users"> | null = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("Not signed in");
    }

    // Store the interviewer's response
    await ctx.runMutation(api.messages.send, {
      interviewId: args.interviewId,
      role: "interviewer",
      body: interviewerResponse,
    });

    if (interviewerResponse === "[silence]") {
      return {
        interviewResponse: ""
      };
    }

    return {
      interviewResponse: interviewerResponse
    };
  },
});