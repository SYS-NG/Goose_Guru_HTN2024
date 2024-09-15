import React from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface IDEProps {
  code: string,
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

export function IDE({ code, setCode }: IDEProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 70; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;

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
    </div>
  );
}
