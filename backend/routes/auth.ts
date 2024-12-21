import { Request, Router } from "express";
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

// POST /v1/auth/register
router.post("/register", async (req, res) => {
    const { name, email, phone, role, clerkId } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email is already registered" });
            return;
        }
        // const hashedclerkId = await bcrypt.hash(clerkId, 10);

        const newUser = new User({
            name,
            email,
            phone,
            role,
            clerkId,
        });

        await newUser.save();

        const user = await User.findOne({ clerkId });

        // res.status(201).json({ message: "User registered successfully" });
        const accessToken = jwt.sign(
            {
                clerkId: user.clerkId,
                role: user.role,
                name: user.name,
            },
            JWT_SECRET
        );

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// POST /v1/auth/login
router.post("/login", async (req, res) => {

    // const hashedclerkId = await bcrypt.hash(clerkId, 10);

    try {
        const { clerkId } = req.body;
        const user = await User.findOne({ clerkId });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            {
                clerkId: user.clerkId,
                role: user.role,
                name: user.name,
            },
            JWT_SECRET
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});



router.get('/upgrade/:version', authenticate, async (req: RequestWithUser, res): Promise<any> => {
    const userId = req.user?._id; // Extract user ID from authenticated request
    const { version } = req.params; // Extract version from route parameters

    if (!userId) {
        return res.status(400).json({ message: "Invalid user ID" }); // Validate userId presence
    }

    try {
        // Fetch the user from the database by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" }); // Ensure user exists
        }

        let subscription_plan= version
        let upgradedRole = 'admin'; // Default to the provided version
        let ai_generation_limit = 0; // Default AI generation limit

        // Determine the upgrade path based on the user's current role
        if (version === "admin_v3") {
            ai_generation_limit = 3;
        } else if (version === "admin_v7") {
            ai_generation_limit = 7;
        } else if (version === "admin_v10") {
            ai_generation_limit = 10;
        }
        else {
            subscription_plan = 'free';
            upgradedRole = 'user';
            ai_generation_limit = 0;
        }


        // Update the user document with the new role and AI generation limit
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: upgradedRole, ai_generation_limit,subscription_plan },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(500).json({ message: "User update failed" }); // Handle update failure
        }

        res.status(200).json({
            message: "User role updated successfully",
            updatedUser
        }); // Send a success response
    } catch (error) {
        console.error("Error upgrading user role:", error); // Log errors for debugging
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


export const auth = router;
