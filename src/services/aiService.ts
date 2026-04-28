import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface RecommendationRequest {
  donorHistory: any[];
  availableCampaigns: any[];
}

export interface MatchingRequest {
  volunteerSkills: string[];
  currentEvents: any[];
}

export const aiService = {
  /**
   * AI suggests where donations should go for maximum impact based on history.
   */
  async getDonationRecommendations(data: RecommendationRequest) {
    const prompt = `Based on this donor history: ${JSON.stringify(data.donorHistory)}, and these active campaigns: ${JSON.stringify(data.availableCampaigns)}, suggest the top 3 campaigns for this donor. Return JSON array with campaignId and reason.`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      return [];
    }
  },

  /**
   * Detects suspicious payments or fake users based on patterns.
   */
  async detectFraud(transactionData: any) {
    const prompt = `Analyze this transaction for potential fraud (high frequency from same IP, unusual amounts, mismatched geo data): ${JSON.stringify(transactionData)}. Return JSON { score: 1-100, isSuspicious: boolean, reason: string }.`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (error) {
      return { score: 0, isSuspicious: false, reason: "Analysis failed" };
    }
  },

  /**
   * Matches best volunteer for best task based on skills.
   */
  async matchVolunteer(data: MatchingRequest) {
    const prompt = `Match this volunteer (Skills: ${data.volunteerSkills.join(", ")}) with the most suitable active events from: ${JSON.stringify(data.currentEvents)}. Return JSON array of { eventId, matchScore, reason }.`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (error) {
      return [];
    }
  },

  /**
   * Ranks most urgent campaigns based on funding gap and end date.
   */
  async getCampaignPriority(campaigns: any[]) {
    const prompt = `Rank these campaigns by urgency (1-10): ${JSON.stringify(campaigns)}. Consider funding gap and proximity to deadlines. Return JSON array of { campaignId, priorityScore, urgencyReason }.`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (error) {
      return [];
    }
  },

  /**
   * Predicts potential donor churn.
   */
  async predictDonorRetention(donorProfile: any, donationHistory: any[]) {
    const prompt = `Predict if this donor (Profile: ${JSON.stringify(donorProfile)}, History: ${JSON.stringify(donationHistory)}) is at risk of churning. Return JSON { churnRisk: 1-100, prediction: string, suggestedAction: string }.`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (error) {
      return { churnRisk: 0, prediction: "Low Risk", suggestedAction: "Continue standard engagement" };
    }
  }
};
