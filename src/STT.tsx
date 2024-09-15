import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { speakText } from '@/SpeakText';
import { Problem } from "@/ProgrammingQuestions";

interface STTProps {
  problem: Problem;
  restartCounter: number;
  handleStart: () => void;
  code: string;
  modelResponse: null | string;
  setModelResponse: React.Dispatch<React.SetStateAction<null | string>>;
}

export const STT: React.FC = ({ problem, restartCounter, handleStart, code, modelResponse, setModelResponse }: STTProps) => {
  const [transcript, setTranscript] = useState(''); // Final transcript
  const transcriptRef = useRef(transcript); // Ref to hold latest transcript
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState(''); // Interim results
  const [interviewId, setInterviewId] = useState<Id<"interviews">>();

  const getInterviewIdQuery = useQuery(api.interview.getCurrentInterview);
  const generateResponse = useAction(api.conversation.generateResponse);

  const problemDesc = problem.Prompt.join("\n\n");
  const currentCode = code;

  useEffect(() => {
    // Fetch the interview ID whenever the user ID changes
    const fetchInterviewId = async () => {
      const interview =  {getInterviewIdQuery};
      setInterviewId(interview.getInterviewIdQuery?._id);
    };

    fetchInterviewId();
  }, [getInterviewIdQuery, restartCounter]); // useEffect when start button pressed

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Check if SpeechRecognition is available in the browser
  const SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startRecognition = () => {
    if (!recognition) {
      alert('SpeechRecognition is not supported in this browser.');
      return;
    }

    // Set recognition parameters
    recognition.lang = 'en-US'; // You can set it to your preferred language
    recognition.interimResults = true; // Enable interim results for continuous feedback
    recognition.maxAlternatives = 1;

    // Handle the result event (interim and final results)
    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      setInterimTranscript(interimText);
      setTranscript((prevTranscript) => prevTranscript + finalText);
    };

    // Handle when recognition starts
    recognition.onstart = () => {
      console.log('Speech recognition started');
      setRecognitionActive(true);
    };

    // Handle when recognition ends (reset everything and restart with 2s delay)
    recognition.onend = async () => {
      console.log('Speech recognition ended, resetting...');
      console.log('USER:', transcriptRef.current); // Use ref here

      try {
        let res = null;

        if (interviewId) {
          // Await the generateResponse action
          const response = await generateResponse({ 
            interviewId: interviewId,
            message: transcriptRef.current, 
            problemDesc: problemDesc,
            currentCode: currentCode,
          });
          res = response.interviewResponse;
          setModelResponse(res);
          console.log('ASSISTANT:', res);
        }

        if (res !== null) {
          // Await the speakText function
          await speakText(res);
          console.log('Speech completed.');
        }
      } catch (error) {
        console.error('Error during response generation or speech:', error);
      }

      // Reset transcripts and restart the recognition process after a delay
      setTranscript('');
      setInterimTranscript('');
      setRecognitionActive(false);

      startRecognition(); // Restart the recognition process
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setRecognitionActive(false);
    };

    // Start speech recognition
    recognition.start();
  };

  return (
    <Button 
      className="bg-gray-500 text-white hover:bg-gray-600 w-[150px]"
      onClick={() => {
        handleStart()
        startRecognition()
      }}
      disabled={recognitionActive}
    >
      Start Interview
    </Button>
  );
};
