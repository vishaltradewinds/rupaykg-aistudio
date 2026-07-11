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
      
      let errorMsg = 'AI generation failed';
      if (!response.ok) {
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const error = await response.json();
            errorMsg = error.error || errorMsg;
          } else {
            errorMsg = `AI generation failed with status: ${response.status}`;
          }
        } catch (e) {
          errorMsg = `AI generation failed with status: ${response.status}`;
        }
        throw new Error(errorMsg);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from AI service");
      }
      
      const text = await response.text();
      if (text.trim().startsWith("<")) {
        throw new Error("Received HTML instead of JSON from AI service");
      }
      
      const data = JSON.parse(text);
      
      // Compatibility Layer for existing code expecting .text as property or .response.text() as function
      const textVal = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return {
        ...data,
        text: textVal,
        response: {
          text: () => textVal
        }
      };
    }
  }
};
