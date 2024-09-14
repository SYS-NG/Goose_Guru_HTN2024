/* Haven't test this yet! */

// Check for the correct SpeechRecognition object depending on the browser
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    // Set recognition properties
    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = false; // Disable interim results (can be true to see partial results)
    recognition.maxAlternatives = 1; // Only return one alternative result

    // Event fired when the speech recognition service returns a result
    recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        console.log('Speech recognized:', speechResult);
        // Handle the recognized speech here, e.g., display it in the UI
    };

    // Event fired when speech recognition encounters an error
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        // Handle errors, such as "no-speech" or "network" errors
    };

    // Start speech recognition
    recognition.start();
} else {
    console.error('Speech recognition not supported in this browser.');
}
