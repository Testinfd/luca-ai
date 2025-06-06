
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { ImagePart } from "../types";

let ai: GoogleGenAI | null = null;

const getAIClient = (apiKey: string): GoogleGenAI => {
  if (!apiKey) {
    throw new Error("API_KEY is not provided to getAIClient.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const initializeChatSession = (apiKey: string, systemInstruction: string): Chat => {
  if (!apiKey) {
    throw new Error("API_KEY is required to initialize chat session.");
  }
  if (!systemInstruction) {
    throw new Error("System instruction is required to initialize chat session.");
  }
  const client = getAIClient(apiKey);
  try {
    const chat = client.chats.create({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return chat;
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw new Error(`Failed to initialize Gemini chat session. ${error instanceof Error ? error.message : String(error)}`);
  }
};

export async function* sendMessageToAI(
  chat: Chat, 
  text: string, 
  image?: ImagePart
): AsyncGenerator<string, void, undefined> {
  if (!chat) {
    throw new Error("Chat session is not initialized.");
  }
  try {
    const parts: Part[] = [];
    if (text.trim()) {
      parts.push({ text });
    }
    if (image) {
      parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
    }

    if (parts.length === 0) {
      // Should not happen if ChatInput validation is correct, but as a safeguard
      yield ""; 
      return;
    }

    // Corrected line: 'contents: { parts }' changed to 'message: parts'
    const result = await chat.sendMessageStream({ message: parts }); 
    for await (const chunk of result) {
      // Access text directly from chunk as per Gemini API guidelines
      if (chunk && typeof chunk.text === 'string') {
        yield chunk.text;
      } else {
        // console.warn("Received a chunk without text or text() method:", chunk);
        yield ""; 
      }
    }
  } catch (error) {
    console.error("Error sending message stream to AI:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Check for specific Gemini API errors related to content if possible
    if (errorMessage.includes(" candidats: 0")) { // Heuristic for empty response / content filter
         throw new Error(`AI content policy violation or invalid input. Please try rephrasing or using a different image. Details: ${errorMessage}`);
    }
    throw new Error(`AI communication failed: ${errorMessage}`);
  }
}
