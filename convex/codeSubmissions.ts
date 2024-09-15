import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

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

interface Message {
  role: string;
  body: string;
}

interface CohereResponse {
  generations: Array<{
    text: string;
  }>;
}

export const evaluateChatHistory = action({
  args: { },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    // Get the interview ID
    const interview = await ctx.runQuery(api.interview.getCurrentInterview);
    console.log("INTERVIEW", interview)
    if (interview === null)
    {
      throw new Error("No ongoing interview");
    }
  
    // Get the chat history
    const previousMessages: Message[] = await ctx.runQuery(api.interview.getInterviewMessages, {
      interviewId: interview._id
    });

    // // Prepare the prompt with chat history
    // const chatHistory: string = previousMessages
    //   .map((msg: Message) => `${msg.role}: ${msg.body}`)
    //   .join("\n") + `\n`;

    const chatHistory: string = `
      interviewer: Welcome to the coding interview! Let's start with a simple problem. Please write a function that takes two numbers and returns their sum.
      user: Sure! Here's my solution:

      function add(a, b) {
        return a + b;
      }

      interviewer: Great, your solution looks correct. Now, let's make it more interesting. What if the inputs could also be strings representing numbers? Could you modify your function to handle that case?
      user: Got it! I'll update the function to convert strings to numbers before adding them:

      function add(a, b) {
        return Number(a) + Number(b);
      }

      interviewer: Good approach! But what happens if the input is not a valid number? Can you add some error handling to account for that?
      user: Yes, I can add a check to handle invalid input:

      function add(a, b) {
        if (isNaN(a) || isNaN(b)) {
          throw new Error('Invalid input');
        }
        return Number(a) + Number(b);
      }

      interviewer: Nice! Your function is now more robust. Let's move on to performance. How would you optimize this function if it were part of a large-scale application where performance is critical?
      user: I think the function is already pretty optimal for this case, as adding two numbers is O(1). But if we were handling large datasets or repeated calculations, I might cache results or batch operations.
      interviewer: Good thinking! That concludes this part of the interview. Do you have any questions for me before we wrap up?
      user: No questions at the moment. Thanks for your time!
      interviewer: You're welcome! We'll be in touch with feedback soon. Have a great day!
    `

    const outputStructure = {
      overallFeedback: "string",
      overallScore: "number",
      engagment: {
        feedback: "string",
        score: "number"
      },
      honesty: {
        feedback: "string",
        score: "number"
      },
      openness: {
        feedback: "string",
        score: "number"
      },
      clear: {
        feedback: "string",
        score: "number"
      },
      areasForImprovement: ["string"]
    };

    console.log(chatHistory);

    // Prepare the prompt with question data
    const prompt: string = `
      You are an experienced HR professional evaluating a chat history between a technical interviewer and a software engineer candidate for a role in your company. Your main focus for this assessment is the candidate's engagement, openness, clarity, and honesty in the conversation. Please analyze the chat history based on the following criteria:
      1. **Engagement**: How actively does the candidate participate in the conversation? Do they ask relevant questions, show interest in the company and role, and provide detailed responses? Treat any prolonged silences or one-word answers as a lack of engagement.
      2. **Openness**: Does the candidate share their thoughts and experiences freely? Are they receptive to new ideas or feedback? Do they discuss both strengths and areas for improvement?
      3. **Clarity**: How well does the candidate articulate their thoughts and experiences? Are their responses clear, concise, and easy to understand? Do they use relevant examples to illustrate their points?
      4. **Honesty**: Does the candidate appear to be truthful and authentic in their responses? Do they admit when they don't know something, and do their claims about their skills and experiences seem consistent and realistic?

      Please provide detailed, actionable feedback on each of these aspects. Highlight areas where the candidate excelled and where they could improve. If there are many instances of silence or lack of engagement during the chat, reflect this in your scoring and feedback.
      Give scores for each category and an overall score from 1 to 10, where 10 represents an excellent performance. Emphasize the importance of active participation and genuine interaction in the interview process.

      The conversations are expected to be short, so do not judge the number of dialogues. Instead focus on the number of silence input from the user.

      Here is the chat history to evaluate:
      "${chatHistory}"

      Output Structure: ${JSON.stringify(outputStructure, null, 2)}

      Respond only with valid JSON that matches the provided structure.
      `;

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
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API request failed: ${response.statusText}`);
    }

    const cohereResponse = await response.json();
    const submissionResponse: string = cohereResponse.text;

    if (userId === null) {
      throw new Error("Not signed in");
    }

    console.log(submissionResponse)
    return {
      submissionResponse: submissionResponse
    };
  }
})


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
