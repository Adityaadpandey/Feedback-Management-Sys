import jwt from "jsonwebtoken";
import User from "../models/Users"; // Import your User model
import { JWT_SECRET } from "../routes/auth"; // Import your JWT secret

interface User {
  clerkId: string;
  role: string;
}
interface decoded {
  clerkId: string;
  role: string;
}

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as decoded;
    const user = await User.findOne({clerkId:decoded.clerkId}); // Assuming your JWT contains `userId`

    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = { _id: user._id, email: user.email, role: user.role }; // Attach user's `_id` and other relevant info
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }
};

export default authenticate;

// we can directly access the clerk id and auth it while the form is being created and things like that
// import { clerkMiddleware } from '@clerk/express'
// clerkMiddleware()

// app.use(requireAuth())

// Apply middleware to a specific route - requires `process.env.CLERK_SIGN_IN_URL` to be present
// app.get('/protected', requireAuth(), (req, res) => {
//     res.send('This is a protected route')
//   })
