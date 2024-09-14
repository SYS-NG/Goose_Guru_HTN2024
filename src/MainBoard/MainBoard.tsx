// MainBoard.tsx
import { Interviewer } from "@/Interviewer/Interviewer";
import { IDE } from "@/IDE/IDE";

export function MainBoard() {
  return (
    <div className="flex justify-center w-full h-full m-4 gap-5">
      {/* First Column */}
      <div className="flex flex-col flex-1 gap-5">
        <Interviewer grow={2} />
        <Interviewer grow={3} />
      </div>

      {/* Second Column */}
      <div className="flex flex-col flex-1 gap-5">
        <Interviewer grow={3} />
        <IDE grow={2} />
      </div>
    </div>
  );
}
