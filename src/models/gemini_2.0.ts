import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey });

export async function generateResponseFromGemini(
    prompt: string
): Promise<string | undefined> {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    return response.text;
}
