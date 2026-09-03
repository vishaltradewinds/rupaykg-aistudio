/**
 * PROXY CLIENT FOR GEMINI AI
 * Redirects all AI calls through the server to protect API keys.
 * Protected server routes require the active RupayKg bearer token.
 */

import { safeFetch, safeParseJson } from "../utils/safeJson.ts";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("rupay_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const ai = {
  models: {
    generateContent: async (args: any) => {
      try {
        let response: Response | null = null;
        for (let i = 0; i < 3; i++) {
          response = await safeFetch('/api/ai/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
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

        const textVal = data.candidates?.[0]?.content?.parts?.[0]?.text || data.text || "";
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
