// MainBoard.tsx
import React, { useState } from 'react';
import { Interviewer } from "@/Interviewer/Interviewer";
import { Question } from "@/Question/Question";
import { IDE } from "@/IDE/IDE";
import { Output } from "@/Output/Output";

export function MainBoard({}) {
  const [codeExecResult, setCodeExecResult] = useState("");

  return (
    <div className="flex flex-col md:flex-row justify-center w-full h-screen m-4 gap-5">
      {/* First Column */}
      <div className="flex flex-col flex-1 gap-5 h-full">
        {/* Interviewer - 25% Height */}
        <Interviewer 
          imageSrc="https://media.wired.com/photos/5932933926780e6c04d2cc4d/master/pass/ff_musk4_f.jpg" 
          label="Hey there! I am Elongated Muskrat, the AI overlord."
        />
        {/* Question - 75% Height */}
        <Question 
          questionTitle="Choosing Teams"
          questionDifficulty="Easy"
          questionTopics={[ "greedy", "implementation", "sortings" ]}
          questionPrompt="The Saratov State University Olympiad Programmers Training Center (SSU OPTC) has *n* students. For each student you know the number of times he/she has participated in the ACM ICPC world programming championship. According to the ACM ICPC rules, each person can participate in the world championship at most 5 times. The head of the SSU OPTC is recently gathering teams to participate in the world championship. Each team must consist of exactly three people, at that, any person cannot be a member of two or more teams. What maximum number of teams can the head make if he wants each team to participate in the world championship with the same members at least *k* times?"
        />
      </div>

      {/* Second Column */}
      <div className="flex flex-col flex-1 gap-5 h-full">
        <IDE setCodeExecResult={setCodeExecResult} />
        <Output codeExecResult={codeExecResult} />
      </div>
    </div>
  );
}
