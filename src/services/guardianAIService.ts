import { ai } from "../lib/gemini";

// ========================================================
// HEDERA GUARDIAN AI TOOLKIT
// ========================================================

/**
 * AI-powered analysis for Hedera Guardian workflows.
 * Bridges raw waste data with formal ESG Methodologies (ACM0022, etc.)
 */

export class GuardianAIToolkit {
  private static reportCache: Record<string, string> = {};

  /**
   * Analyzes an anchored VC against international carbon standards 
   * (Verra, Gold Standard, CDM) to generate a "Methodology Alignment Report".
   */
  static async generateMethodologyReport(vc: any): Promise<string> {
    if (this.reportCache[vc.id]) {
      return this.reportCache[vc.id];
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
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt
      });
      const result = response.text || "Failed to generate alignment report.";
      if (response.text) {
        this.reportCache[vc.id] = result;
      }
      return result;
    } catch (err) {
      console.error("Guardian AI Report Error:", err);
      return "Critical failure in Guardian AI analysis.";
    }
  }

  /**
   * Natural Language Query for Hedera HCS Topic
   */
  static async queryHederaTopic(messages: any[], query: string): Promise<string> {
    const prompt = `
      You are the Guardian AI Assistant for the RupayKg Carbon Registry. 
      The following is a list of HCS (Hedera Consensus Service) messages retrieved from Topic 0.0.4592011:
      
      ${JSON.stringify(messages.slice(-10), null, 2)}
      
      User Query: "${query}"
      
      Based ON ONLY the ledger data above, provide a precise answer. If the data is not there, say so.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt
      });
      return response.text || "I cannot interpret the HCS ledger at this moment.";
    } catch (err) {
      console.error("Guardian Ledger AI Query Error:", err);
      return "HCS Data interpretation failure.";
    }
  }
}
