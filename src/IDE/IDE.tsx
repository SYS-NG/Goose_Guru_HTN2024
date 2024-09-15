import React, { useMemo } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface IDEProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

export function IDE({ code, setCode }: IDEProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 70; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;

  // Calculate the number of lines
  const lineCount = useMemo(() => {
    return code.split("\n").length;
  }, [code]);

  // Generate an array for line numbers
  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  }, [lineCount]);

  return (
    <div
      style={{
        display: "flex",
        height: componentHeight,
        border: "1px solid #ddd",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Line Numbers */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#eee",
          textAlign: "right",
          userSelect: "none",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        {lineNumbers.map((number) => (
          <div key={number} style={{ height: "1.5em" }}>
            {number}
          </div>
        ))}
      </div>

      {/* Code Editor */}
      <div style={{ flex: 1, position: "relative" }}>
        <CodeEditor
          value={code}
          language="py"
          placeholder="Please enter Python code."
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          style={{
            width: "100%",
            height: "100%",
            fontSize: "16px", // Bigger font
            fontFamily:
              'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
            backgroundColor: "transparent",
            resize: "none",
            border: "none",
            outline: "none",
            overflow: "auto",
          }}
        />
      </div>
    </div>
  );
}
