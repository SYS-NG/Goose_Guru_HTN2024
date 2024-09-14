interface InterviewerProps {
  grow: number;
}

export function Interviewer({ grow }: InterviewerProps) {
  return (
    <div className={`flex-grow-[${grow}] w-full h-full bg-gray-100 rounded-md p-4`}>
    </div>
  )
}
