import { Chat } from "@/Chat/Chat";
import { ChatIntro } from "@/Chat/ChatIntro";
import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import { Authenticated, Unauthenticated, useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { MainBoard } from "@/MainBoard/MainBoard";
import { useState } from "react";

export default function App() {
  const user = useQuery(api.users.viewer);
  const executeCode = useAction(api.codeExecution.executeCode);
  const endInterview = useMutation(api.interview.endInterview);
  const submitCode = useAction(api.codeSubmissions.submit);
  
  const [code, setCode] = useState(
    'print("UNIT TEST 1 PASSED")\nprint("UNIT TEST 2 PASSED")\nprint("UNIT TEST 3 PASSED")'
  );
  const [codeExecResult, setCodeExecResult] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>('pq1');

  const handleSubmit = async () => {
    try {
      // Sending the code to backend
      const result = await executeCode({ language: "py", code: code });
      console.log("Execute Code Result:", result);
      
      console.log("here")
      const submitResult = await submitCode({
        problemId: "1", 
        problemQuestion: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order. The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.", 
        userAns: "class Solution:\ndef merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:\nmidx = m - 1\nnidx = n - 1 \nright = m + n - 1\nwhile nidx >= 0:\nif midx >= 0 and nums1[midx] > nums2[nidx]:\nnums1[right] = nums1[midx]\nmidx -= 1\nelse:\nnums1[right] = nums2[nidx]\nnidx -= 1\nright -= 1", 
        canonicalAns: "class Solution:\ndef merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:"
      });
      console.log("Submit Code Result:", submitResult);

      const endResult = await endInterview();
      console.log("End Button Result:", endResult);
  
    } catch (error) {
      console.error("Error in Submit:", error);
    }
  };

  // Handle Run button logic
  const handleRun = async () => {
    try {
      // Sending the code to backend
      const result = await executeCode({ language: "py", code: code });
      if (result.error === "") {
        setCodeExecResult(result.output);
        console.log("Output:", result.output);
      } else {
        console.log("Error in Run:", result.error);
      }
    } catch (error) {
      console.error("Error in Run:", error);
    }
  };

  return (
    <Layout
      menu={
        <Authenticated>
          <UserMenu>{user?.name ?? user?.email}</UserMenu>
        </Authenticated>
      }
      handleSubmit={handleSubmit}
      handleRun={handleRun}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
    >
      <>
        <Authenticated>
          <MainBoard code={code} setCode={setCode} codeExecResult={codeExecResult} selectedOption={selectedOption} />
          <></> {/* Placeholder */}
          {/* <ChatIntro />
          <Chat viewer={(user ?? {})._id!} /> */}
        </Authenticated>
        <Unauthenticated>
          <></> {/* Placeholder */}
          <SignInForm />
        </Unauthenticated>
      </>
    </Layout>
  );
}
