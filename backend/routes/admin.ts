import { GoogleGenerativeAI } from "@google/generative-ai";
import { Router } from "express";
import Analytics from "../models/Analytics";
import Form from "../models/Form";
import Responses from "../models/Responses";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: "\nYou are provided with a feedback form and its responses. Analyze them and provide a summary in the following exact JSON format:\n\n{\n  \"overall\": \"Summary of the overall feedback.\",\n  \"next_steps\": \"The next actionable steps based on the feedback.\",\n  \"key_conclusions\": [\"Key conclusion 1\", \"Key conclusion 2\", \"...\"]\n}\n1. The \"overall\" field should summarize the overall feedback provided by the users in whole in a broder way.\n2. The \"next_steps\" field should outline clear steps for the user to follow based on the feedback.\n3. The \"key_conclusions\" field should be a list of key conclusions and actionable outcomes derived from the feedback.\n\nPlease ensure:\n- The JSON is correctly formatted and valid.\n",
    tools: [{ codeExecution: {} }],
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

async function run(prompt: string) {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error during AI processing:", error);
        throw new Error("Failed to generate analytics from AI.");
    }
}

const router = Router();

// GET all forms
router.get("/", (req, res) => {
    res.send("Admin");
});

// GET analytics for a specific form by ID
router.get("/ai/:id", async (req, res): Promise<any> => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Form ID is required" });
    }

    try {
        // Check if analytics already exist
        let analytics = await Analytics.findOne({ formId: id });

        if (!analytics) {
            // Fetch form and responses data
            const form = await Form.findById(id);
            if (!form) {
                return res.status(404).json({ message: "Form not found" });
            }

            const responses = await Responses.find({ formId: id });

            // Prepare the prompt for AI
            const prompt = JSON.stringify({
                form,
                responses,
            });

            // Run AI model
            const aiResponse = await run(prompt);

            // Parse AI response
            const { overall, next_steps, key_conclusions } = JSON.parse(aiResponse);

            // Save analytics to the database
            analytics = await Analytics.create({
                formId: id,
                overall,
                next_steps,
                key_conclusions,
            });

            // res.json(aiResponse);
        }

        res.json(analytics);
    } catch (error) {
        console.error("Error generating analytics:", error.message);
        res.status(500).json({ message: "An error occurred while generating analytics." });
    }
});

export const admin = router;
