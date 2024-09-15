import React from 'react';

interface OutputProps {
  codeExecResult: string;
}

export function Output({ codeExecResult }: OutputProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 30; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${
    fixedPixels * (percentage / 100)
  }px)`;

  return (
    <div
      style={{ height: componentHeight }}
      className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-auto"
    >
      {/* Header */}
      <div className="flex items-center bg-gray-800 px-4 py-2">
        {/* Terminal-like Buttons */}
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <h2 className="ml-4 text-sm font-bold">Output</h2>
      </div>

      {/* Content */}
      <div className="p-4 overflow-auto">
        <pre className="whitespace-pre text-sm font-mono">
          {codeExecResult
            .split('\n')
            .filter((result) => result.trim() !== '')
            .map((result, index) => (
              <div
                key={index}
                className={
                  result.startsWith('UNIT TEST FAILED')
                    ? 'text-red-400'
                    : 'text-green-400'
                }
              >
                $ {result}
              </div>
            ))}
        </pre>
      </div>
    </div>
  );
}
