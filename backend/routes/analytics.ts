import { Router, Request, Response } from "express";
import { optionalAuth } from "../middleware/authenticator"; // Authentication middleware
import Form from "../models/Form"; // Form model
import ResponseModel from "../models/Responses"; // Response model

// Define the type for authenticated user (you can expand this based on your schema)
interface AuthenticatedUser {
  _id: string;
}

// Extend the Request type to include the user field
interface RequestWithUser extends Request {
  user?: AuthenticatedUser | null;
}

const router = Router();

// Analytics panel route
router.get("/", optionalAuth, async (req: RequestWithUser, res: Response):Promise<any> => {
  try {
    const userId = req.user?._id; // User ID from the request (authenticated user)
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Fetch all forms created by the user
    const forms = await Form.find({ createdBy: userId });
    if (forms.length === 0) {
      return res.status(404).json({ message: "No forms found" });
    }

    // For each form, fetch the associated responses
    const formsWithResponses = await Promise.all(
      forms.map(async (form) => {
        // Get all responses for the current form
        const responses = await ResponseModel.find({ formId: form._id });

        return {
          form,
          responses,
          responseCount: responses.length,
        };
      })
    );

    res.status(200).json({
      message: "Analytics fetched successfully",
      data: formsWithResponses,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
    return;
  }
});

export const analytics = router;
