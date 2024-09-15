// Interviewer.tsx
import React from 'react';

interface InterviewerProps {
  imageSrc: string; // Source URL for the image
  altText?: string; // Optional alt text for accessibility
  label?: string; // Optional text to display at the bottom
}

export function Interviewer({ imageSrc, altText = "Interviewer Icon", label }: InterviewerProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 30; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;  

  return (
    <div
      style={{ height: componentHeight }}
      className="overflow-hidden bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md border border-gray-300"
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt={altText}
          className="rounded-full object-cover w-24 h-24 border-4 border-blue-300"
        />
        {/* Optional: Add a video camera icon overlay */}
        {/* <div className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1">
          <svg
            className="w-4 h-4 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M10 5V2l5 3-5 3V6.5a.5.5 0 0 1 .5-.5zM0 4v8h2V4H0zm14 4v-2l-5 3v2.5a.5.5 0 0 0 .5.5H15v-3z"/>
          </svg>
        </div> */}
      </div>
      
      {/* Conditionally render the label if it exists */}
      {label && (
        <div className="mt-4 px-4 py-2 bg-gray-100 rounded-md shadow-inner">
          <span className="text-sm text-gray-800">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
