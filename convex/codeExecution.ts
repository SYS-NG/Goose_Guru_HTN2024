import { action } from "./_generated/server";
import { v } from "convex/values";

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

    // Define language IDs (you may need to expand this based on Judge0 CE's supported languages)
    const languageIds = {
      'c': 50,
      'cpp': 54,
      'java': 62,
      'python': 71,
      // Add more languages as needed
    };
    console.log(code)
    // Encode the source code in base64
    const encodedCode = btoa(code);
    console.log(encodedCode)

    // First API call to submit the code
    const submitUrl = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
    const submitOptions = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': `${process.env.RAPID_API_KEY}`,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language_id: 71, // Default to Python
        source_code: encodedCode,
        stdin: ''  // You can add stdin if needed
      })
    };

    try {
      const submitResponse = await fetch(submitUrl, submitOptions);
      const submitResult = await submitResponse.json();
      const token = submitResult.token;

      // Second API call to get the results
      const resultUrl = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`;
      const resultOptions = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': `${process.env.RAPID_API_KEY}`,
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
      };

      // Wait for a short time to allow processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const resultResponse = await fetch(resultUrl, resultOptions);
      const result = await resultResponse.json();

      // Decode the output
      const decodedOutput = result.stdout ? atob(result.stdout) : '';
      const decodedError = result.stderr ? atob(result.stderr) : '';

      return {
        output: decodedOutput,
        error: decodedError,
        exitCode: result.exit_code,
        executionTime: result.time,
        memory: result.memory
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to execute code');
    }
  },
});

// codeX - it is down for some reason
// export const executeCode = action({
//   args: {
//     language: v.string(),
//     code: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const { language, code } = args;

//     // CodeX API endpoint
//     const CODEX_API = 'https://api.codex.jaagrav.in';

//     const data = {
//       code: code,
//       language: language,
//     };

//     const response = await fetch(`${CODEX_API}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams(data).toString(),
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed: ${response.statusText}`);
//     }

//     const result = await response.json();

//     return {
//       result: result.output.trim(),
//       error: result.error || null,
//     };
//   },
// });