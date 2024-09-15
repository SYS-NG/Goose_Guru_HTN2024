import { ReactNode, useState } from "react";
import { GetStartedDialog } from "@/GetStarted/GetStartedDialog";
import { Button } from "@/components/ui/button"
import { QuestionSelector } from "@/Navbar/QuestionSelector"
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { STT } from "@/STT";

export function Layout({
  menu,
  children,
}: {
  menu?: ReactNode;
  children: ReactNode;
}) {
  const [restartCounter, setRestartCount] = useState(0);

  const startInterview = useMutation(api.interview.startInterview);
  const handleStart = async () => {
    try {
      // Sending the code to backend
      const result = await startInterview();
      setRestartCount(restartCounter + 1);
      console.log("Start Button Result:", result);
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
            <QuestionSelector />
            <STT restartCounter={restartCounter} handleStart={handleStart} />
            <Button className="bg-gray-500 text-white hover:bg-gray-600 w-[100px]">Run</Button>
            <Button className="bg-green-500 text-white hover:bg-green-600 w-[100px]">Submit</Button>
          </div>
          {menu}
        </nav>
      </header>
      <main className="flex grow flex-col overflow-hidden">{children}</main>
    </div>
  );
}
