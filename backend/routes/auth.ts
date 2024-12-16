import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/Users";

const router = Router();

// JWT secrets
export const JWT_SECRET = "thisshouldbeasecretprotectedbyusonlysoonecan";


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
    const { clerkId } = req.body;
    // const hashedclerkId = await bcrypt.hash(clerkId, 10);

    try {
        const { name, email, phone, role, clerkId } = req.body;
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

export const auth = router;
