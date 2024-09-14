import React, { useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

interface InterviewerProps {
  grow: number;
}

export function IDE({ grow }: InterviewerProps) {
  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
  return (
    <CodeEditor
      value={code}
      language="js"
      placeholder="Please enter JS code."
      onChange={(evn) => setCode(evn.target.value)}
      padding={15}
      style={{
        flexGrow: grow,
        backgroundColor: "#f5f5f5",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
    />
  );
}
