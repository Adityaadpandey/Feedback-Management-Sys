import { Request, Response, Router } from "express";
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

// Centralized error handler
const handleError = (res: Response, statusCode: number, message: string, error?: any) => {
    console.error(error); // Log error details for debugging
    res.status(statusCode).json({ message, error });
};

// Analytics panel route
router.get("/", authenticate, async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Aggregate forms with response counts and the latest response time
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
                    lastResponseAt: { $arrayElemAt: ["$responses.submittedAt", -1] }, // Get last response date
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
    } catch (error) {
        handleError(res, 500, "Error fetching analytics", error);
    }
});

// Form response analytics
router.get("/formresponse/:id", authenticate, async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id;
        const formId = req.params.id;

        if (!userId) return res.status(401).json({ message: "Authentication required" });
        if (!formId) return res.status(400).json({ message: "Form ID is required" });

        // Find the form and its responses in a single call
        const form = await Form.findOne({ _id: formId, createdBy: userId });
        if (!form) return res.status(404).json({ message: "Form not found" });

        const responses = await ResponseModel.find({ formId });
        if (!responses.length) return res.status(404).json({ message: "No responses found" });

        // Get the last response time and response rate
        const lastResponseAt = responses[responses.length - 1].submittedAt;
        const responseRate = ((responses.length / responses.length) * 100).toFixed(2) || "0";

        res.status(200).json({
            message: "Form analytics fetched successfully",
            form,
            responses,
            information: {
                totalResponses: responses.length,
                lastResponseAt,
                responseRate: `${responseRate}%`,
            },
        });
    } catch (error) {
        handleError(res, 500, "Error fetching form analytics", error);
    }
});

export const analytics = router;
