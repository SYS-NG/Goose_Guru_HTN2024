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
   * The language code (e.g., 'en-US', 'es-ES'). Defaults to 'en-US'.
   */
  lang?: string;

  /**
   * The pitch of the voice (range: 0 to 2). Defaults to 1.
   */
  pitch?: number;

  /**
   * The rate at which the text is spoken (range: 0.1 to 10). Defaults to 1.
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
    voiceName = '', // Optional: Specify a particular voice name
    lang = 'en-GB',  // Default language set to British English
    pitch = 1,
    rate = 1,
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

      // If a specific voice name is provided, try to find it
      if (voiceName) {
        const desiredVoice = voices.find((voice) => voice.name === voiceName);
        if (desiredVoice) {
          utterance.voice = desiredVoice;
        } else {
          console.warn(`Voice "${voiceName}" not found. Using default voice.`);
        }
      }

      // If no voiceName is provided or the desired voice is not found, use the first available voice
      if (!utterance.voice) {
        utterance.voice = voices[0];
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
