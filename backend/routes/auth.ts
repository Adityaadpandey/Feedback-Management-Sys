import bcrypt from "bcryptjs";
import { Router } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/Users";

const router = Router();

// JWT secrets
const JWT_SECRET = "your-secret-key";
const JWT_REFRESH_SECRET = "your-refresh-secret-key";
const refreshTokens: string[] = [];

// POST /v1/auth/register
router.post("/register", async (req, res) => {
  const { name, email, phone, role, clerkId } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email is already registered" });
      return;
    }

    const newUser = new User({
      name,
      email,
      phone,
      role,
      clerkId,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// POST /v1/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }

      

      const accessToken = jwt.sign(
        { clerkId: user.clerkId, role: user.role },
        JWT_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { clerkId: user.clerkId },
        JWT_REFRESH_SECRET
      );

      refreshTokens.push(refreshToken);

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

export const auth = router;
