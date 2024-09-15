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

  const handleSubmit = async () => {
    try {
      // Sending the code to backend
      const result = await executeCode({ language: "py", code: code });
      console.log("Submit Button Result:", result);
      
      const endResult = await endInterview();
      console.log("End Button Result:", endResult);

      // Leave space for additional submit logic here
      // E.g., saving the code to the database or triggering further actions
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
