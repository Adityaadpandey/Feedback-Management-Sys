import { GeneratedForm } from "@/types/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORM_GENERATION_PROMPT } from "./prompt-templates";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Warning: NEXT_PUBLIC_GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export async function generateForm(
  description: string,
): Promise<GeneratedForm> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      FORM_GENERATION_PROMPT + description,
    );
    const response = await result.response;
    const text = response.text();
    const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1');

    let formData;
    try {
      formData = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", cleaned);
      throw new Error("Invalid JSON format from AI");
    }


    if (!formData.title || !Array.isArray(formData.questions)) {
      throw new Error("Invalid response format from AI");
    }

    return formData as GeneratedForm;
  } catch (error) {
    console.error("Error generating form:", error);
    throw new Error("Failed to generate form with AI");
  }
}
