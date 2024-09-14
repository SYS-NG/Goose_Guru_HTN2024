import { Interviewer } from "@/Interviewer/Interviewer";

export function MainBoard() {
  return (
    <div className="flex justify-center w-full h-screen m-4 gap-5">
      <div className="flex flex-col w-full h-full gap-5">
        <Interviewer grow={2}/>
        <Interviewer grow={3}/>
      </div>

      <div className="flex flex-col w-full h-full gap-5">
        <Interviewer grow={3}/>
        <Interviewer grow={2}/>
      </div>
    </div>
  );
}
