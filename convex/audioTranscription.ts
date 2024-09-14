import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

const GROQ_API_KEY = process.env.GROQ_API_KEY!;

export const transcribe = action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {

    const audioFileURL = await ctx.storage.getUrl(args.storageId);
    // Check if the URL is null or undefined
    if (!audioFileURL) {
      throw new Error("File not found or invalid storageId.");
    }
    console.log(audioFileURL)

    const audioFileResponse = await fetch(audioFileURL);
    if (!audioFileResponse.ok) {
      throw new Error(`Failed to fetch audio file: ${audioFileResponse.statusText}`);
    }
    const audioBuffer = await audioFileResponse.arrayBuffer()

    // Create a FormData object to simulate the multipart/form-data used in cURL
    const formData = new FormData();
    formData.append("file", new Blob([audioBuffer]), "audio.m4a");
    formData.append("model", "distil-whisper-large-v3-en");
    formData.append("temperature", "0");
    formData.append("response_format", "json");
    formData.append("language", "en");

    // Fetch
    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: formData, // Send the FormData Object
    });

    console.log(res)

    const result = await res.json();
    // Pull the message content out of the response
    const transcriptionText = result.text;
    console.log("Transcription:", transcriptionText);

    return transcriptionText;
  },
});