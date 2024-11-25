import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users"; 


const router = Router();

// JWT secrets
const JWT_SECRET = "your-secret-key";
const JWT_REFRESH_SECRET = "your-refresh-secret-key";
const refreshTokens: string[] = [];

// Custom type for request body
interface RegisterBody {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// POST /v1/auth/register
router.post(
  "/register",
    async (req, res) => {
    

    const { name, email, phone, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "Email is already registered" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

// POST /v1/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }

      const accessToken = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ email: user.email }, JWT_REFRESH_SECRET);

      refreshTokens.push(refreshToken);

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

// POST /v1/auth/logout
router.post("/logout", (req: Request, res: Response): void => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  const index = refreshTokens.indexOf(refreshToken);
  if (index === -1) {
    res.status(400).json({ message: "Invalid refresh token" });
    return;
  }

  refreshTokens.splice(index, 1);
  res.json({ message: "Logged out successfully" });
});

// POST /v1/auth/refresh-token
router.post("/refresh-token", (req: Request, res: Response): void => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  if (!refreshTokens.includes(refreshToken)) {
    res.status(400).json({ message: "Invalid refresh token" });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { email: string };
    const newAccessToken = jwt.sign({ email: payload.email }, JWT_SECRET, { expiresIn: "15m" });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(400).json({ message: "Invalid refresh token" });
  }
});

export const auth = router;
