import React, { useState, useEffect, useRef } from 'react';

interface InterviewerProps {
  imageSrc: string; // Source URL for the image
  altText?: string; // Optional alt text for accessibility
  label?: string;   // Optional text to display inside the textbox
  placeholder?: string; // Placeholder text when label is not provided
  streamingSpeed?: number; // Time in milliseconds between each character
}

export function Interviewer({
  imageSrc,
  altText = "Interviewer Icon",
  label = "",
  placeholder = "Waiting for response...",
  streamingSpeed = 100, // Default streaming speed (milliseconds per character)
}: InterviewerProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 30;   // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${
    fixedPixels * (percentage / 100)
  }px)`;

  // State to manage the displayed text
  const [displayedText, setDisplayedText] = useState<string>("");
  const intervalRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for the textarea

  useEffect(() => {
    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset displayed text
    setDisplayedText("");

    if (label) {
      let currentIndex = 0;

      intervalRef.current = window.setInterval(() => {
        setDisplayedText((prevText) => {
          const nextText = label.slice(0, currentIndex + 1);
          currentIndex++;

          if (currentIndex >= label.length) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          }

          return nextText;
        });
      }, streamingSpeed);

      // Cleanup function
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      // If label is empty, clear displayedText
      setDisplayedText("");
    }
  }, [label, streamingSpeed]);

  // Auto-scroll to the bottom when displayedText updates
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div
      style={{ height: componentHeight }}
      className="overflow-hidden bg-white rounded-lg p-4 flex items-center shadow-md border border-gray-300"
    >
      {/* Icon Container */}
      <div className="flex-shrink-0">
        <div className="rounded-lg bg-gray-100 p-2">
          <img
            src={imageSrc}
            alt={altText}
            className="rounded-md object-cover w-24 h-24"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="w-6"></div>

      {/* Textbox Container */}
      <div className="flex-1 h-full">
        <textarea
          ref={textareaRef} // Attach the ref to the textarea
          value={displayedText}
          placeholder={!label ? placeholder : ''}
          readOnly={!!label}
          className={`w-full h-full px-4 py-2 border ${
            label ? 'border-gray-300 bg-gray-50' : 'border-blue-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-auto`}
          style={{
            height: '100%', // Ensures the textarea fills the available height
          }}
        />
      </div>
    </div>
  );
}
