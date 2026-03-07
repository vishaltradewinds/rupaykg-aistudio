import { GoogleGenAI } from "@google/genai";

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: "Hello" }] }]
    });
    console.log("Success:", response.text);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
