import { ReactNode, useState } from "react";
import { GetStartedDialog } from "@/GetStarted/GetStartedDialog";
import { Button } from "@/components/ui/button"
import { QuestionSelector } from "@/Navbar/QuestionSelector"
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { STT } from "@/STT";
import { pqs } from "@/ProgrammingQuestions";

interface LayoutProps {
  menu?: ReactNode;
  handleSubmit: () => void;
  handleRun: () => void;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  code: string;
  modelResponse: null | string;
  setModelResponse: React.Dispatch<React.SetStateAction<null | string>>;
  children: ReactNode;
}

export function Layout({
  menu,
  handleSubmit,
  handleRun,
  selectedOption,
  setSelectedOption,
  code,
  modelResponse,
  setModelResponse,
  children,
}: LayoutProps) {
  const [restartCounter, setRestartCount] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false); // Track if interview has started

  const startInterview = useMutation(api.interview.startInterview);
  const handleStart = () => {
    try {
      // Sending the code to backend
      const result = startInterview();
      setRestartCount(restartCounter + 1);
      console.log("Start Button Result:", result);
      setIsInterviewStarted(true); // Enable the buttons after interview starts
    } catch (error) {
      console.error("Error in Start Button:", error);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex min-h-20 border-b bg-background/80 backdrop-blur">
        <nav className="container w-full justify-between flex flex-row items-center gap-6">
          <div className="flex items-center gap-6 md:gap-10">
            <h1 className="text-base font-semibold">Goose Guru</h1>
          </div>
          <div className="flex items-center gap-3">
            <QuestionSelector selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <STT problem={selectedOption in pqs ? pqs[selectedOption as keyof object] : pqs.pq1} restartCounter={restartCounter} handleStart={handleStart} code={code} modelResponse={modelResponse} setModelResponse={setModelResponse} />
            <Button
              className="bg-gray-500 text-white hover:bg-gray-600 w-[100px]" 
              onClick={handleRun}
              disabled={!isInterviewStarted} // Disable until interview starts
            >
                Run
            </Button>
            <Button 
              className="bg-green-500 text-white hover:bg-green-600 w-[100px]" 
              onClick={()=>{handleSubmit; setIsInterviewStarted(false);}}
              disabled={!isInterviewStarted} // Disable until interview starts
            >
              Submit
            </Button>
          </div>
          {menu}
        </nav>
      </header>
      <main className="flex grow flex-col overflow-hidden">{children}</main>
    </div>
  );
}
