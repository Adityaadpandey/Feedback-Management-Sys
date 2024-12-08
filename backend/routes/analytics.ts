import { Router, Request, Response } from "express";
import { optionalAuth } from "../middleware/authenticator";
import Form from "../models/Form";
import ResponseModel from "../models/Responses";

// Define the type for authenticated user
interface AuthenticatedUser {
  _id: string;
}

// Extend the Request type to include the user field
interface RequestWithUser extends Request {
  user?: AuthenticatedUser | null;
}

const router = Router();

// Analytics panel route
router.get("/", optionalAuth, async (req: RequestWithUser, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id; // Extract authenticated user ID
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Fetch forms with response count using aggregation
    const formsWithResponses = await Form.aggregate([
      { $match: { createdBy: userId } }, // Match forms created by the user
      {
        $lookup: {
          from: "responses", // Collection name of the responses
          localField: "_id",
          foreignField: "formId",
          as: "responses",
        },
      },
      {
        $addFields: {
          responseCount: { $size: "$responses" }, // Add response count
        },
      },
      {
        $project: {
          "responses.formId": 0, // Exclude unnecessary fields from responses
        },
      },
    ]);

    if (formsWithResponses.length === 0) {
      return res.status(404).json({ message: "No forms found" });
    }

    res.status(200).json({
      message: "Analytics fetched successfully",
      data: formsWithResponses,
    });
  } catch (error: any) {
    console.error("Error fetching analytics:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

export const analytics = router;
