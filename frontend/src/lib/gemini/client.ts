import { GoogleGenerativeAI } from "@google/generative-ai";
import { FORM_GENERATION_PROMPT } from "./prompt-templates";
import { GeneratedForm } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Warning: NEXT_PUBLIC_GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export async function generateForm(description: string): Promise<GeneratedForm> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(FORM_GENERATION_PROMPT + description);
    const response = await result.response;
    const text = response.text();
    
    const formData = JSON.parse(text);
    
    if (!formData.title || !Array.isArray(formData.questions)) {
      throw new Error("Invalid response format from AI");
    }
    
    return formData as GeneratedForm;
  } catch (error) {
    console.error("Error generating form:", error);
    throw new Error("Failed to generate form with AI");
  }
}