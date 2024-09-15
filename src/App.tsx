import { Chat } from "@/Chat/Chat";
import { ChatIntro } from "@/Chat/ChatIntro";
import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useMutation,
  useAction,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { MainBoard } from "@/MainBoard/MainBoard";
import { useState, useEffect } from "react";
import { pqs } from "@/ProgrammingQuestions";
import ReactMarkdown from "react-markdown";

// Import ShadUI components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export default function App() {
  const user = useQuery(api.users.viewer);
  const executeCode = useAction(api.codeExecution.executeCode);
  const endInterview = useMutation(api.interview.endInterview);
  const submitCode = useAction(api.codeSubmissions.submit);
  const evalChat = useAction(api.codeSubmissions.evaluateChatHistory);

  const [code, setCode] = useState("");
  const [codeExecResult, setCodeExecResult] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("pq1");
  const [modelResponse, setModelResponse] = useState<null | string>(null);

  // New state variables for feedback, popup, and loading
  const [codeFeedback, setCodeFeedback] = useState<string | null>(null);
  const [chatFeedback, setChatFeedback] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedOption in pqs) {
      setCode(pqs[selectedOption as keyof typeof pqs].DocTag);
    } else {
      setCode(pqs.pq1.DocTag);
    }
  }, [selectedOption]);

  const handleSubmit = async () => {
    try {
      setLoading(true); // Start loading
      // Sending the code to backend
      const unitTest =
        selectedOption in pqs
          ? pqs[selectedOption as keyof typeof pqs].UnitTest
          : pqs.pq1.UnitTest;
      const result = await executeCode({
        language: "py",
        code: code + "\n\n\n" + unitTest,
      });
      console.log("Execute Code Result:", result);

      const submitResult = await submitCode({
        problemId: "1",
        problemQuestion:
          "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order...",
        userAns: code, // Assuming 'code' contains the user's answer
        canonicalAns:
          "class Solution:\n    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:",
      });
      console.log("Submit Code Result:", submitResult.submissionResponse);

      const evalChatResult = await evalChat();
      console.log("Eval Chat Result", evalChatResult.submissionResponse);

      await endInterview();

      // Save feedback to state
      setCodeFeedback(submitResult.submissionResponse);
      setChatFeedback(evalChatResult.submissionResponse);

      // Open the popup
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error in Submit:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle Run button logic
  const handleRun = async () => {
    try {
      // Sending the code to backend
      const unitTest =
        selectedOption in pqs
          ? pqs[selectedOption as keyof typeof pqs].UnitTest
          : pqs.pq1.UnitTest;
      const result = await executeCode({
        language: "py",
        code: code + "\n\n\n" + unitTest,
      });
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
      code={code}
      modelResponse={modelResponse}
      setModelResponse={setModelResponse}
    >
      <>
        <Authenticated>
          <MainBoard
            code={code}
            setCode={setCode}
            codeExecResult={codeExecResult}
            selectedOption={selectedOption}
            modelResponse={modelResponse}
          />

          {/* Loading Indicator */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
              <Spinner />
            </div>
          )}

          {/* Popup Dialog */}
          {isPopupOpen && (
            <Dialog
              open={isPopupOpen}
              onOpenChange={(open) => {
                setIsPopupOpen(open);
              }}
            >
              <DialogContent className="max-h-[80vh] overflow-auto">
                <DialogHeader className="flex justify-between items-center">
                  <DialogTitle>Feedback</DialogTitle>
                  <button
                    onClick={() => {
                      setIsPopupOpen(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </DialogHeader>
                <Tabs defaultValue="codeFeedback">
                  <TabsList className="mb-4">
                    <TabsTrigger value="codeFeedback">Code Feedback</TabsTrigger>
                    <TabsTrigger value="chatFeedback">Chat Feedback</TabsTrigger>
                  </TabsList>
                  <TabsContent value="codeFeedback">
                    <ReactMarkdown>{codeFeedback ?? ""}</ReactMarkdown>
                  </TabsContent>
                  <TabsContent value="chatFeedback">
                    <ReactMarkdown>{chatFeedback ?? ""}</ReactMarkdown>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </>
    </Layout>
  );
}

// Spinner Component
function Spinner() {
  return (
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  );
}
