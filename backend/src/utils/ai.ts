import axios from "axios";
import config from "../config";

/**
 * Summarize medical records and generate AI analysis using Gemini API
 * @param text - The medical records text to summarize
 * @returns summary string
 */
export async function summarizeMedicalRecords(text: string): Promise<string> {
  if (!config.ai.geminiKey) return "Gemini API key not configured.";

  try {
    const prompt = `You are a medical AI assistant. Summarize the following medical records in 2-3 lines and provide an AI analysis report:\n\n${text}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.ai.geminiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Gemini response structure: candidates[0].content.parts[0].text
    const generatedText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary returned.";
    return generatedText;
  } catch (err: any) {
    console.error(
      "Gemini summarization error:",
      err.response?.data || err.message
    );
    return err.response?.data?.error?.message || "Failed to generate summary.";
  }
}
