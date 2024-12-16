import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/authenticator";
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
router.get("/", authenticate, async (req: RequestWithUser, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Aggregate forms with response counts
    const formsWithResponses = await Form.aggregate([
      {
        $match: { createdBy: userId }, // Match forms created by the user
      },
      {
        $lookup: {
          from: "responses", // Collection name of responses
          localField: "_id", // Join key in Form
          foreignField: "formId", // Join key in Response
          as: "responses",
        },
      },
      {
        $project: {
          title: 1, // Include only necessary fields
          responseCount: { $size: "$responses" }, // Add response count
        },
      },
    ]);

    if (!formsWithResponses.length) {
      return res.status(404).json({ message: "No forms found" });
    }

    res.status(200).json({
      message: "Analytics fetched successfully",
      data: formsWithResponses,
    });
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


router.get('/formresponse/:id', authenticate,  async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
        }

        const formId = req.params.id;
        if (!formId) {
        return res.status(400).json({ message: "Form ID is required" });
        }

        // Find form by ID
        const form = await Form.findOne({ _id: formId, createdBy: userId });
        if (!form) {
        return res.status(404).json({ message: "Form not found" });
        }
        const form_data = await Form.findOne({ _id: formId });

        const responses = await ResponseModel.find({ formId: formId });

        if (responses.length === 0) {
            return res.status(404).json({
                message: "No responses found"
            });
        }


        res.status(200).json({
            message: "Form analytics fetched successfully",
            form: form_data,
            responses: responses,
            information: {
                totalResponses: responses.length,
                lastResponseAt: responses[responses.length - 1].submittedAt,
                responseRate: "100%"
            }
        });
    } catch (error: any) {
        console.error("Error fetching form analytics:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
    });


export const analytics = router;
