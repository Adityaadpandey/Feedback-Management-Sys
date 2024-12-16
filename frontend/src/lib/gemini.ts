import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export interface GeneratedQuestion {
  questionText: string;
  questionType: string;
  options?: string[];
}

const PROMPT_TEMPLATE = `
Create a form based on the following description. Only use these question types:
- short-answer
- paragraph
- multiple-choice
- checkbox
- dropdown
- date
- time
- rating
- linear-scale

Return the response in this exact JSON format:
{
  "title": "Form title here",
  "questions": [
    {
      "questionText": "Question text here",
      "questionType": "one of the allowed types",
      "options": ["option1", "option2"] // Only for multiple-choice, checkbox, dropdown
    }
  ]
}

Description:
don't use \n for new lines as the data will not be able to be validated properly

`;

export async function generateForm(description: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(PROMPT_TEMPLATE + description);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const formData = JSON.parse(text);

    // Validate the response format
    if (!formData.title || !Array.isArray(formData.questions)) {
      throw new Error("Invalid response format from AI");
    }

    return formData;
  } catch (error) {
    console.error("Error generating form:", error);
    throw error;
  }
}
