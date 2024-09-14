import React, { useState, useRef } from 'react';

export const AudioSTT: React.FC = () => {
  const [transcript, setTranscript] = useState(''); // Final transcript
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState(''); // Interim results

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
    recognition.onend = () => {
      // Delay restarting the recognition by 2 seconds
      setTimeout(() => {
        console.log('Speech recognition ended, resetting...');
  
        // Reset transcripts and restart the recognition process
        setTranscript('');
        setInterimTranscript('');
        setRecognitionActive(false);

        console.log('Restarting recognition after 2s delay...');
        startRecognition(); // Restart the recognition process after the delay
      }, 2000); // 2000 milliseconds = 2 seconds
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setRecognitionActive(false);
    };

    // Start speech recognition
    recognition.start();
  };

  const stopRecognition = () => {
    if (recognition && recognitionActive) {
      recognition.stop();
    }
  };

  return (
    <div>
      <h1>Speech to Text using Web Speech API</h1>
      <button onClick={startRecognition} disabled={recognitionActive}>
        Start Recognition
      </button>
      <button onClick={stopRecognition} disabled={!recognitionActive}>
        Stop Recognition
      </button>

      <p><strong>Final Transcript:</strong> {transcript}</p>
      <p><strong>Interim Transcript:</strong> {interimTranscript}</p>
    </div>
  );
};
