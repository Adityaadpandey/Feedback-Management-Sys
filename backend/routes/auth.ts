import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/authenticator";
import User from "../models/Users";

const JWT_SECRET = process.env.JWT_SECRET;

const router = Router();

interface AuthenticatedUser {
    _id: string;
}

// Extend the Request type to include the user field
interface RequestWithUser extends Request {
    user?: AuthenticatedUser | null;
}

// Helper function for creating JWT
const createJwtToken = (user: any) => {
    return jwt.sign(
        {
            clerkId: user.clerkId,
            role: user.role,
            name: user.name,
        },
        JWT_SECRET
    );
};

// Enhanced error handler
const handleError = (res: Response, statusCode: number, message: string, error?: any) => {
    console.error(error); // Log error details for debugging

    if (error && error.message === "AI generation limit exceeded") {
        return res.status(400).json({
            message: "Error updating analytics",
            error: { message: error.message },
        });
    }

    res.status(statusCode).json({ message, error });
};

// POST /v1/auth/register
router.post("/register", async (req, res):Promise<any> => {
    const { name, email, phone, role, clerkId } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return handleError(res, 400, "Email is already registered");

        const newUser = new User({ name, email, phone, role, clerkId });
        await newUser.save();
        const user = await User.findOne({ clerkId });

        const accessToken = createJwtToken(user);

        res.status(201).json({
            accessToken: accessToken,
            role: user.role,
            subscriptionPlan: user.subscription_plan,
            ai_generation_limit: user.ai_generation_limit,
            message: "User registered successfully",

        });
    } catch (error) {
        handleError(res, 500, "Internal server error", error);
    }
});

// POST /v1/auth/login
router.post("/login", async (req, res):Promise<any> => {
    const { clerkId } = req.body;

    try {
        const user = await User.findOne({ clerkId });
        if (!user) return handleError(res, 401, "Invalid credentials");

        const accessToken = createJwtToken(user);

        res.status(200).json({
            accessToken: accessToken,
            role: user.role,
            subscriptionPlan: user.subscription_plan,
            ai_generation_limit: user.ai_generation_limit,
        });
    } catch (error) {
        handleError(res, 500, "Internal server error", error);
    }
});

// POST /v1/auth/upgrade/:version
router.get("/upgrade/:version", authenticate, async (req: RequestWithUser, res: Response):Promise<any> => {
    const userId = req.user?._id;
    const { version } = req.params;

    if (!userId) return handleError(res, 400, "Invalid user ID");

    try {
        const user = await User.findById(userId);
        if (!user) return handleError(res, 404, "User not found");

        let subscriptionPlan = "free";
        let upgradedRole = "user";
        let aiGenerationLimit = 0;

        const upgradeConfig: Record<string, { role: string, aiGenerationLimit: number }> = {
            admin_v3: { role: "admin", aiGenerationLimit: 3 },
            admin_v7: { role: "admin", aiGenerationLimit: 7 },
            admin_v10: { role: "admin", aiGenerationLimit: 10 },
        };

        const upgradeData = upgradeConfig[version] || { role: "user", aiGenerationLimit: 0 };
        subscriptionPlan = upgradeData.role === "admin" ? version : "free";

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: upgradeData.role, ai_generation_limit: upgradeData.aiGenerationLimit, subscription_plan: subscriptionPlan },
            { new: true }
        );

        if (!updatedUser) return handleError(res, 500, "User update failed");

        res.status(200).json({
            message: "User role updated successfully",
            role: updatedUser.role,
            ai_generation_limit: updatedUser.ai_generation_limit,
            subscriptionPlan: updatedUser.subscription_plan,

        });
    } catch (error) {
        handleError(res, 500, "Internal server error", error);
    }
});

export const auth = router;
