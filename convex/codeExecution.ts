import { action } from "./_generated/server";
import { v } from "convex/values";

// Define the structure for test cases
const TestCase = v.object({
  input: v.string(),
  expectedOutput: v.string(),
});

/*
  Expecting code to be a single block the runs all by itself
*/
/*
SAMPLE:
var data = qs.stringify({
    'code': 'val = int(input("Enter your value: ")) + 5\nprint(val)',
    'language': 'py',
    'input': '7'
});
*/

export const executeCode = action({
  args: {
    language: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const { language, code } = args;

    // CodeX API endpoint
    const CODEX_API = "https://api.codex.jaagrav.in";

    const data = {
      code: code,
      language: language,
    };

    const response = await fetch(`${CODEX_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data).toString(),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      result: result.output.trim(),
      error: result.error || null,
    };
  },
});