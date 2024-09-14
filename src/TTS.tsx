import React, { useState, useEffect } from 'react';

export const TTS = () => {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    // Fetch available voices from the browser
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0) {
                setSelectedVoice(availableVoices[0]); // Set the default voice
            }
        };

        // Load voices asynchronously
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }
    }, []);

    const speak = () => {
        if (text.trim()) {
            const speech = new SpeechSynthesisUtterance(text);

            // Set the selected voice
            if (selectedVoice) {
                speech.voice = selectedVoice;
            }

            // Optional: Set language, pitch, rate, and volume
            speech.lang = selectedVoice?.lang || 'en-US';
            speech.pitch = 1;
            speech.rate = 1;
            speech.volume = 1;

            window.speechSynthesis.speak(speech);
        }
    };

    return (
        <div>
            <h1>Text to Speech Example</h1>

            <textarea
                rows="4"
                cols="50"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to convert to speech"
            />
            <br />

            <label htmlFor="voice-select">Choose a voice:</label>
            <select
                id="voice-select"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                    const selected = voices.find(voice => voice.name === e.target.value);
                    setSelectedVoice(selected);
                }}
            >
                {voices.map((voice, index) => (
                    <option key={index} value={voice.name}>
                        {voice.name} ({voice.lang})
                    </option>
                ))}
            </select>
            <br />

            <button onClick={speak}>Speak</button>
        </div>
    );
};
