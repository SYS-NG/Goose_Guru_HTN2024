// MainBoard.tsx
import React, { useState } from 'react';
import { Interviewer } from "@/Interviewer/Interviewer";
import { Question } from "@/Question/Question";
import { IDE } from "@/IDE/IDE";
import { Output } from "@/Output/Output";
import { pqs } from "@/ProgrammingQuestions";

interface MainBoardProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  codeExecResult: string;
  selectedOption: string;
  modelResponse: null | string;
}

export function MainBoard({ code, setCode, codeExecResult, selectedOption, modelResponse }: MainBoardProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center w-full h-screen m-4 gap-5">
      {/* First Column */}
      <div className="flex flex-col flex-1 gap-5 h-full">
        {/* Interviewer - 25% Height */}
        <Interviewer 
          imageSrc="https://media.wired.com/photos/5932933926780e6c04d2cc4d/master/pass/ff_musk4_f.jpg" 
          label={modelResponse !== null ? modelResponse : ""}
        />
        {/* Question - 75% Height */}
        <Question 
          problem={selectedOption in pqs ? pqs[selectedOption as keyof object] : pqs.pq1}  
        />
      </div>

      {/* Second Column */}
      <div className="flex flex-col flex-1 gap-5 h-full">
        <IDE code={code} setCode={setCode} />
        <Output codeExecResult={codeExecResult} />
      </div>
    </div>
  );
}
