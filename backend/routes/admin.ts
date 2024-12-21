import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Router } from "express";
import { authenticate } from "../middleware/authenticator";
import Analytics from "../models/Analytics";
import Form from "../models/Form";
import Responses from "../models/Responses";
import User from "../models/Users";

interface AuthenticatedUser {
    _id: string;
}

// Extend the Request type to include the user field
interface RequestWithUser extends Request {
    user?: AuthenticatedUser | null;
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: `
You are provided with a feedback form and its responses. Analyze them and provide a summary in the following exact JSON format:

{
  "overall": "Summary of the overall feedback.",
  "next_steps": "The next actionable steps based on the feedback.",
  "key_conclusions": ["Key conclusion 1", "Key conclusion 2", "..."]
}

Please ensure:
1. The JSON is correctly formatted and valid.
2. Summarize feedback clearly and provide actionable insights.`,
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

async function runAI(prompt: string): Promise<any> {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);
        return JSON.parse(result.response.text()); // Parse AI response directly
    } catch (error) {
        console.error("Error during AI processing:", error);
        throw new Error("Failed to generate analytics from AI.");
    }
}

const router = Router();

/** Utility Function: Update AI Generation Limit for User */
async function decrementUserLimit(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.ai_generation_limit <= 0) {
        throw new Error("AI generation limit exceeded");
    }

    await User.findByIdAndUpdate(userId, {
        ai_generation_limit: user.ai_generation_limit - 1,
    });
}

/** GET all forms (Placeholder Endpoint) */
router.get("/", (req, res) => {
    res.send("Admin");
});

/** GET analytics for a specific form by ID */
router.get("/ai/:id", authenticate, async (req: RequestWithUser, res):Promise<any> => {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Form ID is required" });
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    try {
        // Check if analytics already exist
        let analytics = await Analytics.findOne({ formId: id });

        if (!analytics) {
            // Fetch form and responses
            const form = await Form.findById(id);
            if (!form) return res.status(404).json({ message: "Form not found" });

            const responses = await Responses.find({ formId: id });

            // Run AI model
            const aiResponse = await runAI(JSON.stringify({ form, responses }));

            // Save analytics to the database
            analytics = await Analytics.create({
                formId: id,
                ...aiResponse,
            });

            // Decrement AI generation limit
            await decrementUserLimit(userId);
        }

        res.json(analytics);
    } catch (error) {
        console.error("Error generating analytics:", error.message);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});

/** POST to update analytics for a specific form */
router.post("/ai/push/:id", authenticate, async (req: RequestWithUser, res):Promise<any> => {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Form ID is required" });
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    try {
        // Fetch form and responses
        const form = await Form.findById(id);
        if (!form) return res.status(404).json({ message: "Form not found" });

        const responses = await Responses.find({ formId: id });

        // Run AI model
        const aiResponse = await runAI(JSON.stringify({ form, responses }));

        // Check if analytics already exist
        let analytics = await Analytics.findOne({ formId: id });

        if (analytics) {
            // Update existing analytics
            analytics.overall = aiResponse.overall;
            analytics.next_steps = aiResponse.next_steps;
            analytics.key_conclusions = aiResponse.key_conclusions;
            analytics.updatedOn = new Date();
            await analytics.save();
        } else {
            // Create new analytics
            analytics = await Analytics.create({
                formId: id,
                ...aiResponse,
            });
        }

        // Decrement AI generation limit
        await decrementUserLimit(userId);

        res.json(analytics);
    } catch (error) {
        console.error("Error updating analytics:", error.message);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});

export const admin = router;
