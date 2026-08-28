import { ai } from "../lib/gemini";

// ========================================================
// HEDERA GUARDIAN AI TOOLKIT
// ========================================================

/**
 * AI-powered analysis for Hedera Guardian workflows.
 * Bridges raw waste data with formal ESG Methodologies (ACM0022, etc.)
 */

function safeGetSessionItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    return window.sessionStorage.getItem(key);
  }
  return null;
}

function safeSetSessionItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(key, value);
  }
}

export class GuardianAIToolkit {
  private static reportCache: Record<string, string> = {};

  /**
   * Analyzes an anchored VC against international carbon standards 
   * (Verra, Gold Standard, CDM) to generate a "Methodology Alignment Report".
   */
  static async generateMethodologyReport(vc: any): Promise<string> {
    const cacheKey = `guardian_report_${vc.id}`;
    const cached = safeGetSessionItem(cacheKey);
    if (cached) {
      return cached;
    }

    const prompt = `
      As an environmental auditor specializing in the Hedera Guardian ecosystem, 
      analyze the following W3C Verifiable Credential which represents a waste-to-carbon sequestration event:
      
      ${JSON.stringify(vc, null, 2)}
      
      Identify which UNFCCC CDM or Verra/Gold Standard Methodology this record most closely aligns with 
      (e.g., ACM0022 - Large-scale consolidated methodology for alternative waste treatment processes).
      
      Provide:
      1. Alignment Score (0-100)
      2. Missing Data Points for full ISO 14064-2 compliance.
      3. A summary of the "Environmental Additionality" claim.
      
      Keep the tone technical, professional, and audit-ready.
    `;

    try {
      if (safeGetSessionItem('ai_daily_blocked')) {
        throw new Error("AI Daily Quota Exhausted");
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const result = response.text || "Failed to generate alignment report.";
      if (response.text) {
        safeSetSessionItem(cacheKey, result);
      }
      return result;
    } catch (err: any) {
      console.error("Guardian AI Report Error:", err);
      if (err.message?.includes("Daily Quota Exhausted") || err.message?.includes("limit: 20")) {
        safeSetSessionItem('ai_daily_blocked', 'true');
      }
      return "Critical failure in Guardian AI analysis. Please try again later.";
    }
  }

  /**
   * Natural Language Query for Hedera HCS Topic
   */
  static async queryHederaTopic(messages: any[], query: string): Promise<string> {
    const topicId = process.env.HEDERA_TOPIC_ID || 'Active Hedera HCS Topic';
    const prompt = `
      You are the Guardian AI Assistant for the RupayKg Carbon Registry. 
      The following is a list of HCS (Hedera Consensus Service) messages retrieved from Topic ${topicId}:
      
      ${JSON.stringify(messages.slice(-10), null, 2)}
      
      User Query: "${query}"
      
      Based ON ONLY the ledger data above, provide a precise answer. If the data is not there, say so.
    `;

    try {
      if (safeGetSessionItem('ai_daily_blocked')) {
        return "I cannot interpret the HCS ledger at this moment due to high traffic/quota limits. Please try again tomorrow.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      return response.text || "I cannot interpret the HCS ledger at this moment.";
    } catch (err: any) {
      console.error("Guardian Ledger AI Query Error:", err);
      if (err.message?.includes("Daily Quota Exhausted") || err.message?.includes("limit: 20")) {
        safeSetSessionItem('ai_daily_blocked', 'true');
      }
      return "HCS Data interpretation failure.";
    }
  }
}
