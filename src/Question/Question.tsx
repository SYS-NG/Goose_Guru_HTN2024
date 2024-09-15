// Import necessary dependencies and ShadUI components
import React from 'react';
import { Badge } from '@/components/ui/badge'; // Adjust the import path based on your project structure

interface QuestionProps {
  questionTitle: string;
  questionPrompt: string;
  questionDifficulty: "Easy" | "Medium" | "Hard";
  questionTopics: string[];
}

export function Question({ questionTitle, questionPrompt, questionDifficulty, questionTopics }: QuestionProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 70; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;  

  // Define color schemes based on difficulty using ShadUI's predefined variants
  const difficultyVariants: { [key in QuestionProps["questionDifficulty"]]: "success" | "warning" | "destructive" } = {
    Easy: "success",
    Medium: "warning",
    Hard: "destructive",
  };

  return (
    <div
      style={{ height: componentHeight }}
      className="overflow-auto bg-white rounded-md p-6 shadow-md flex flex-col items-start space-y-4"
    >
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900">{questionTitle}</h1>

      {/* Difficulty and Topics Labels */}
      <div className="flex flex-wrap items-center space-x-2">
        {/* Difficulty Label */}
        <Badge variant={difficultyVariants[questionDifficulty]}>
          {questionDifficulty}
        </Badge>

        {/* Topic Labels */}
        {questionTopics.map((topic, index) => (
          <Badge key={index} variant="secondary">
            {topic}
          </Badge>
        ))}
      </div>

      {/* Prompt */}
      <p className="text-gray-700">{questionPrompt}</p>
      <p className="text-gray-700">{questionPrompt}</p>
      <p className="text-gray-700">{questionPrompt}</p>
    </div>
  );
}
