/**
 * PROXY CLIENT FOR GEMINI AI
 * Redirects all AI calls through the server to protect API keys.
 */

import { safeFetch, safeParseJson } from "../utils/safeJson";

export const ai = {
  models: {
    generateContent: async (args: any) => {
      try {
        let response = null;
        for (let i = 0; i < 3; i++) {
          response = await safeFetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(args)
          });
          if (response) break;
          await new Promise(res => setTimeout(res, 1000 * (i + 1)));
        }

        if (!response) {
          throw new Error('AI service temporarily unavailable. Please try again.');
        }

        const data = await safeParseJson(response);

        if (!response.ok) {
          const errorMsg = data?.error || `AI generation failed with status: ${response.status}`;
          throw new Error(errorMsg);
        }

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
