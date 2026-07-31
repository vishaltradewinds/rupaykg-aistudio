/**
 * PROXY CLIENT FOR GEMINI AI
 * Redirects all AI calls through the server to protect API keys.
 */

import { safeFetch, safeParseJson } from "../utils/safeJson";

export const ai = {
  models: {
    generateContent: async (args: any) => {
      try {
        const response = await safeFetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args)
        });

        if (!response) {
          throw new Error('AI service temporarily unavailable. Please try again.');
        }

        let errorMsg = 'AI generation failed';
        if (!response.ok) {
          try {
            const data = await safeParseJson(response);
            errorMsg = data?.error || `AI generation failed with status: ${response.status}`;
          } catch (e) {
            errorMsg = `AI generation failed with status: ${response.status}`;
          }
          throw new Error(errorMsg);
        }

        const data = await safeParseJson(response);
        if (!data) {
          throw new Error("Received invalid response from AI service");
        }

        const textVal = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return {
          ...data,
          text: textVal,
          response: {
            text: () => textVal
          }
        };
      } catch (err: any) {
        console.warn("AI generateContent error:", err);
        throw new Error(err.message || 'AI generation service error');
      }
    }
  }
};
