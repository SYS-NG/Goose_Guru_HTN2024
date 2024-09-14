interface InterviewerProps {
  grow: number;
}

export function Interviewer({ grow }: InterviewerProps) {
  return (
    <div
      style={{ flexGrow: grow }}
      className="bg-gray-100 rounded-md p-4 flex items-center justify-center"
    >
      <span className="text-lg">Flex Grow: {grow}</span>
    </div>
  );
}
