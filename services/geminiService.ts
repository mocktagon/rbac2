
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResponse, ViewState } from "../types";

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

interface SupportResponse {
    text: string;
    suggestedView?: ViewState;
    actionLabel?: string;
}

export const getSupportResponse = async (query: string, currentView: string): Promise<SupportResponse | null> => {
    const ai = getClient();
    if (!ai) return null;

    const prompt = `
      You are the AI Support Agent for "Control Tower", an enterprise governance platform.
      The user is currently on the "${currentView}" page.
      
      User Query: "${query}"
      
      Available Views (Routes):
      - dashboard (Overview)
      - projects (Manage Budget Caps, Project Status)
      - blueprints (Interview Templates)
      - talent (Candidate Pools, Global Reservoir)
      - roles (Access Control, Permissions)
      - settings (GDPR, Compliance, Federation)
      - finops (Billing, Invoices, Unit Economics)
      - integrations (Connect Greenhouse, Slack, etc)

      Respond helpfully. If the user wants to perform an action available in a specific view, suggest navigating there.
      
      Return JSON:
      {
        "text": "Your helpful response...",
        "suggestedView": "view_name_from_list_above" (Optional, only if navigation is needed),
        "actionLabel": "Go to Settings" (Optional, button text)
      }
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
                        text: { type: Type.STRING },
                        suggestedView: { type: Type.STRING },
                        actionLabel: { type: Type.STRING }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) return null;
        return JSON.parse(text) as SupportResponse;

    } catch (error) {
        console.error("Support Agent Failed:", error);
        return { text: "I'm having trouble connecting to the support brain right now." };
    }
};
