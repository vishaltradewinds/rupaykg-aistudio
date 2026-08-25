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

        const textVal =
          data?.text ||
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          (typeof data === "string" ? data : "");

        return {
          ...(typeof data === "object" ? data : {}),
          text: textVal,
          candidates: data?.candidates || [
            {
              content: {
                parts: [{ text: textVal }]
              },
              finishReason: "STOP"
            }
          ],
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
