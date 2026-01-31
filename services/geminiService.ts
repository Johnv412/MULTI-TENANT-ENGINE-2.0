
import { GoogleGenAI } from "@google/genai";

/**
 * PROTOTYPE ONLY: In a production environment, 
 * API keys should never be exposed on the frontend.
 * TODO: Move to server-side session tokenization.
 */
const getAPIKey = (): string => {
  return process.env.API_KEY || '';
};

export const getGeminiClient = () => {
  const apiKey = getAPIKey();
  if (!apiKey) {
    throw new Error("Missing API Key. Ensure process.env.API_KEY is configured.");
  }
  return new GoogleGenAI({ apiKey });
};

export const sendChatMessage = async (history: any[], message: string, systemInstruction: string) => {
  const ai = getGeminiClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction,
    },
  });
  
  // Convert history to match sendMessage expectation if needed, 
  // but simpler to just pass message here as we use a stateless helper or managed chat.
  const response = await chat.sendMessage({ message });
  return response.text;
};
