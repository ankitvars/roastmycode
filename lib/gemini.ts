import { GoogleGenerativeAI } from '@google/generative-ai';

let client: GoogleGenerativeAI | null = null;

export function getGemini(): GoogleGenerativeAI {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
}

export function getFlashModel() {
  return getGemini().getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature:      0.4,
      maxOutputTokens:  2048,
      responseMimeType: 'application/json',
    },
  });
}
