// Question.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge'; // Adjust the import path based on your project structure
import ReactMarkdown from 'react-markdown';
import { Problem } from '@/ProgrammingQuestions';

interface QuestionProps {
  problem: Problem;
}

export function Question({ problem }: QuestionProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 70; // Percentage of remaining height

  // Calculate the component height using calc()
  const composedHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;

  // Define color schemes based on difficulty using ShadUI's predefined variants
  const difficultyVariants: { [key in Problem["Difficulty"]]: "success" | "warning" | "destructive" } = {
    Easy: "success",
    Medium: "warning",
    Hard: "destructive",
  };

  return (
    <div
      className="max-w-4xl mx-auto bg-white rounded-md p-6 shadow-md"
      style={{ height: composedHeight, overflowY: 'auto' }}
    >
      <div className="space-y-6">
        {/* Header: No & Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          {problem.No}. {problem.Title}
        </h1>

        {/* Badges: Difficulty and Topics */}
        <div className="flex flex-wrap items-center space-x-2">
          {/* Difficulty Badge */}
          <Badge variant={difficultyVariants[problem.Difficulty]} className="capitalize">
            {problem.Difficulty}
          </Badge>

          {/* Topic Badges */}
          {problem.Topics.map((topic, index) => (
            <Badge key={index} variant="secondary" className="capitalize">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Styled Prompt */}
        <div className="space-y-4">
          {problem.StyledPrompt.map((paragraph, index) => (
            <ReactMarkdown
              key={index}
              components={{
                code: ({ node, inline, className, children, ...props }) => (
                  <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded" {...props}>
                    {children}
                  </code>
                ),
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              }}
              className="text-gray-700"
            >
              {paragraph}
            </ReactMarkdown>
          ))}
        </div>

        {/* Examples Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Examples</h2>
          {problem.Examples.map((example, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm">
              <div className="mb-2">
                <span className="font-medium text-gray-800">Input:</span>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  <code>{example.Input}</code>
                </pre>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-800">Output:</span>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  <code>{example.Output.toString()}</code>
                </pre>
              </div>
              <div>
                <span className="font-medium text-gray-800">Explanation:</span>
                <p className="mt-1 text-gray-700">{example.Explanation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: Canonical Solution and Unit Tests */}
        {/* You can include these sections as needed */}
      </div>
    </div>
  );
}
