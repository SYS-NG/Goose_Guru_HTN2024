import React, { useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

interface IDEProps {}

export function IDE({}: IDEProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 70; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;

  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
  return (
    <CodeEditor
      className="overflow-auto"
      value={code}
      language="py"
      placeholder="Please enter Python code."
      onChange={(evn) => setCode(evn.target.value)}
      padding={15}
      style={{
        height: componentHeight,
        backgroundColor: "#f5f5f5",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        borderRadius: 5,
      }}
    />
  );
}
