interface OutputProps {}

export function Output({}: OutputProps) {
  // Parameters
  const fixedPixels = 150; // Pixels to subtract
  const percentage = 30; // Percentage of remaining height

  // Calculate the component height using calc()
  const componentHeight = `calc(${percentage}vh - ${fixedPixels * (percentage / 100)}px)`;  

  return (
    <div
      style={{ height: componentHeight }}
      className="overflow-auto bg-gray-100 rounded-md p-4 flex items-center justify-center"
    >
    </div>
  );
}
