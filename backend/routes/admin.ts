import { GoogleGenAI } from "@google/genai";
import { Request, Response, Router } from "express";
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
    console.error("❌ GEMINI_API_KEY is not set in the environment variables");
    throw new Error("GEMINI_API_KEY is required");
}

console.log("✅ GEMINI_API_KEY is set");

// Initialize the new Google GenAI SDK
const ai = new GoogleGenAI({
    vertexai: false,
    apiKey: apiKey,
});

// System instruction for the AI
const SYSTEM_INSTRUCTION = `
You are provided with a feedback form and its responses. Analyze them and provide a summary in the following exact JSON format:

{
  "overall": "Summary of the overall feedback.",
  "next_steps": "The next actionable steps based on the feedback.",
  "key_conclusions": ["Key conclusion 1", "Key conclusion 2", "..."]
}

Please ensure:
1. The JSON is correctly formatted and valid.
2. Summarize feedback clearly and provide actionable insights.`;

// Configuration for content generation
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json" as const,
};

async function runAI(prompt: string): Promise<any> {
    try {
        console.log("🤖 Sending request to Gemini...");

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp", // Latest Gemini 2.0 model
            contents: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_INSTRUCTION + "\n\n" + prompt }],
                },
            ],
            config: generationConfig,
        });

        console.log("✅ AI response received");

        // Extract text from response
        const responseText = response.text;

        if (!responseText) {
            throw new Error("Empty response from AI");
        }

        // Parse and return JSON
        return JSON.parse(responseText);
    } catch (error: any) {
        console.error("❌ Error during AI processing:", error);

        // Provide more specific error messages
        if (error.code === 404) {
            throw new Error("Model not found. Please check your API key and model availability.");
        } else if (error.code === 403) {
            throw new Error("API key does not have permission to access this model.");
        } else if (error.code === 429) {
            throw new Error("Rate limit exceeded. Please try again later.");
        } else if (error.message?.includes("API key")) {
            throw new Error("Invalid API key. Please check your GEMINI_API_KEY.");
        }

        throw new Error(`Failed to generate analytics from AI: ${error.message || 'Unknown error'}`);
    }
}

// Centralized error handler
const handleError = (res: Response, statusCode: number, message: string, error?: any) => {
    console.error("❌", message, error);

    // If error message indicates AI generation limit exceeded
    if (error && error.message === "AI generation limit exceeded") {
        return res.status(400).json({
            message: "Error updating analytics",
            error: { message: error.message },
        });
    }

    // General error handler for other errors
    res.status(statusCode).json({
        message,
        error: error?.message || "An unexpected error occurred"
    });
};

// Utility function to decrement user AI generation limit
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

const router = Router();

/** GET analytics for a specific form by ID */
router.get("/ai/:id", authenticate, async (req: RequestWithUser, res: Response): Promise<any> => {
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

            // Decrement AI generation limit
            await decrementUserLimit(userId);

            const responses = await Responses.find({ formId: id });

            // Run AI model
            const aiResponse = await runAI(JSON.stringify({ form, responses }));

            // Save analytics to the database
            analytics = await Analytics.create({
                formId: id,
                ...aiResponse,
            });
        }

        res.json(analytics);
    } catch (error) {
        handleError(res, 500, "Error generating analytics", error);
    }
});

/** POST to update analytics for a specific form */
router.post("/ai/push/:id", authenticate, async (req: RequestWithUser, res: Response): Promise<any> => {
    const userId = req.user?._id;
    const { id } = req.params;
    console.log("id", id, "userId", userId);

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
            Object.assign(analytics, aiResponse, { updatedOn: new Date() });
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
        handleError(res, 500, "Error updating analytics", error);
    }
});

/** GET remaining tokens/credits for the user */
router.get('/checktokens', authenticate, async (req: RequestWithUser, res: Response): Promise<any> => {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        res.json({ tokens: user.ai_generation_limit });
    } catch (error) {
        handleError(res, 500, "Error checking tokens", error);
    }
});

/** POST to manually decrement user tokens (for testing) */
router.post('/sendtokens', authenticate, async (req: RequestWithUser, res: Response): Promise<any> => {
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Authentication required" });

    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        if (user.ai_generation_limit <= 0) {
            return res.status(400).json({
                message: "No tokens remaining",
                tokens: 0
            });
        }

        await User.findByIdAndUpdate(userId, {
            ai_generation_limit: user.ai_generation_limit - 1,
        });

        res.status(200).json({
            message: "Token decremented successfully",
            remaining_tokens: user.ai_generation_limit - 1
        });
    } catch (error) {
        handleError(res, 500, "Error sending tokens", error);
    }
});

export const admin = router;
