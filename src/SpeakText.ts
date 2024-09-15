// speakText.ts

/**
 * Interface defining the options for speech synthesis.
 */
interface SpeechOptions {
  /**
   * The name of the voice to use. If not provided, the default voice is used.
   */
  voiceName?: string;

  /**
   * The language code (e.g., 'en-US', 'es-ES'). Defaults to 'en-GB'.
   */
  lang?: string;

  /**
   * The pitch of the voice (range: 0 to 2). Defaults to 1.
   */
  pitch?: number;

  /**
   * The rate at which the text is spoken (range: 0.1 to 10). Defaults to 1.2 for faster speech.
   */
  rate?: number;

  /**
   * The volume of the speech (range: 0 to 1). Defaults to 1.
   */
  volume?: number;
}

/**
 * Speaks the provided text using the browser's Speech Synthesis API.
 *
 * @param text - The text to be spoken.
 * @param options - Optional settings for speech synthesis.
 * @returns A promise that resolves when speaking is complete or rejects if an error occurs.
 */
export function speakText(text: string, options: SpeechOptions = {}): Promise<void> {
  const {
    voiceName = '',      // Optional: Specify a particular voice name
    lang = 'en-GB',      // Default language set to British English
    pitch = 1,
    rate = 1.2,           // Increased default rate for faster speech
    volume = 1,
  } = options;

  return new Promise<void>((resolve, reject) => {
    // Check if Speech Synthesis API is supported
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech Synthesis API is not supported in this browser.'));
      return;
    }

    // Create a new utterance instance
    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);

    // Apply optional settings
    utterance.lang = lang;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    // Function to select and set the desired voice
    const setVoice = () => {
      const voices: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();

      // List of known British female voice names (this may vary by browser)
      const britishFemaleVoiceNames = [
        'Google UK English Female', // Chrome
        'Alice',                    // macOS
        'Joanna',                   // Amazon Polly (if available)
        'Kate',                     // Microsoft Edge
        // Add more names as needed based on available voices
      ];

      let selectedVoice: SpeechSynthesisVoice | undefined;

      // If a specific voice name is provided, try to find it
      if (voiceName) {
        selectedVoice = voices.find((voice) => voice.name === voiceName);
        if (!selectedVoice) {
          console.warn(`Voice "${voiceName}" not found. Using default female British voice.`);
        }
      }

      // If no specific voiceName is provided or not found, attempt to find a female British voice
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) =>
            voice.lang === 'en-GB' &&
            britishFemaleVoiceNames.includes(voice.name)
        );
      }

      // Fallback: Find any female British voice by heuristic (e.g., names containing 'Female' or known female names)
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) =>
            voice.lang === 'en-GB' &&
            (voice.name.toLowerCase().includes('female') ||
             ['Alice', 'Joanna', 'Kate', 'Emma', 'Victoria'].includes(voice.name))
        );
      }

      // Fallback: Use the first available British English voice
      if (!selectedVoice) {
        selectedVoice = voices.find((voice) => voice.lang === 'en-GB');
        if (selectedVoice) {
          console.warn(`No specific female British voice found. Using voice "${selectedVoice.name}".`);
        }
      }

      // If a voice was found, set it; otherwise, proceed without setting a voice
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        console.warn('No British English voices available. Using default voice.');
      }

      // Start speaking
      window.speechSynthesis.speak(utterance);
    };

    // Event handlers
    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    // Load voices and set the voice
    const voicesAvailable: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();
    if (voicesAvailable.length === 0) {
      // Voices not loaded yet; wait for them to load
      window.speechSynthesis.onvoiceschanged = () => {
        setVoice();
      };
    } else {
      // Voices already loaded
      setVoice();
    }
  });
}
