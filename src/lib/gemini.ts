/**
 * PROXY CLIENT FOR GEMINI AI
 * Redirects all AI calls through the server to protect API keys.
 */

export const ai = {
  models: {
    generateContent: async (args: any) => {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI generation failed');
      }
      const data = await response.json();
      
      // Compatibility Layer for existing code expecting .text as property or .response.text() as function
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return {
        ...data,
        text: text,
        response: {
          text: () => text
        }
      };
    }
  }
};
