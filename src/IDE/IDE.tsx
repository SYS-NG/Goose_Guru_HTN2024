import React, { useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface IDEProps {
  setCodeExecResult: (result: string) => void;
}

export function IDE({ setCodeExecResult }: IDEProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 70; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;

  const [code, setCode] = useState(
    'print("UNIT TEST 1 PASSED")\nprint("UNIT TEST 2 PASSED")\nprint("UNIT TEST 3 PASSED")'
  );

  const executeCode = useAction(api.codeExecution.executeCode);
  const endInterview = useMutation(api.interview.endInterview);
  const submitCode = useAction(api.codeSubmissions.submit);

  const handleSubmit = async () => {
    try {
      // Sending the code to backend
      const result = await executeCode({ language: "py", code: code });
      console.log("Execute Code Result:", result);
      
      console.log("here")
      const submitResult = await submitCode({
        problemId: "1", 
        problemQuestion: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order. The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.", 
        userAns: "class Solution:\ndef merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:\nmidx = m - 1\nnidx = n - 1 \nright = m + n - 1\nwhile nidx >= 0:\nif midx >= 0 and nums1[midx] > nums2[nidx]:\nnums1[right] = nums1[midx]\nmidx -= 1\nelse:\nnums1[right] = nums2[nidx]\nnidx -= 1\nright -= 1", 
        canonicalAns: "class Solution:\ndef merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:"
      });
      console.log("Submit Code Result:", submitResult);

      const endResult = await endInterview();
      console.log("End Button Result:", endResult);
  
    } catch (error) {
      console.error("Error in Submit:", error);
    }
  };

  // Handle Run button logic
  const handleRun = async () => {
    try {
      // Sending the code to backend
      const result = await executeCode({ language: "py", code: code });
      if (result.error === "") {
        setCodeExecResult(result.output);
        console.log("Output:", result.output);
      } else {
        console.log("Error in Run:", result.error);
      }
    } catch (error) {
      console.error("Error in Run:", error);
    }
  };

  return (
    <div>
      <CodeEditor
        value={code}
        language="py"
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleRun} style={{ marginLeft: '10px' }}>Run</button>
      </div>
    </div>
  );
}
