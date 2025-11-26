import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResponse } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeCreditRequest = async (
  projectName: string,
  amount: number,
  reason: string,
  currentUsage: number
): Promise<AIAnalysisResponse | null> => {
  const ai = getClient();
  if (!ai) {
    console.warn("No API Key found for Gemini analysis");
    return null;
  }

  const prompt = `
    You are a Governance AI for a large enterprise. 
    Analyze the following budget credit expansion request.
    
    Project: ${projectName}
    Current Usage: ${currentUsage} credits
    Requested Amount: ${amount} credits
    Reason Provided: "${reason}"

    Assess the validity and urgency. Return a JSON object with:
    - riskScore (0-100, where 100 is high risk/suspicious, 0 is safe/justified)
    - recommendation ("APPROVE", "REJECT", or "REVIEW")
    - summary (Max 20 words explaining the decision)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            recommendation: { type: Type.STRING },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIAnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return null;
  }
};