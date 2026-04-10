import { GoogleGenAI } from "@google/genai";

// The platform automatically provides GEMINI_API_KEY in the environment
export const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY as string 
});
