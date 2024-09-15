import React from 'react';

interface InterviewerProps {
  imageSrc: string; // Source URL for the image
  altText?: string; // Optional alt text for accessibility
  label?: string; // Optional text to display at the bottom
}

export function Interviewer({ imageSrc, altText = "Icon", label }: InterviewerProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 30; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;  

  return (
    <div
      style={{ height: componentHeight }}
      className="overflow-auto bg-gray-100 rounded-md p-4 flex flex-col items-center justify-center"
    >
      <img
        src={imageSrc}
        alt={altText}
        className="rounded-full object-cover w-16 h-16"
      />
      
      {/* Conditionally render the label if it exists */}
      {label && (
        <div className="mt-3 px-3 py-1 bg-white rounded-md shadow-md">
          <span className="text-sm text-gray-800">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
