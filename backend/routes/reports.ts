import { Request, Router } from "express";
import { authenticate } from "../middleware/authenticator";
import Form from "../models/Form";
import ResponseModel from "../models/Responses";

const router = Router();


// Define the type for authenticated user
interface AuthenticatedUser {
    _id: string;
  }

  // Extend the Request type to include the user field
  interface RequestWithUser extends Request {
    user?: AuthenticatedUser | null;
  }


// GET all forms responses by id

router.get("/form/:id",authenticate, async (req, res):Promise<any> => {
    try {
        const { id } = req.params;
        const responses = await ResponseModel.find({ formId: id });

        if (responses.length === 0) {
            return res.status(404).json({
                message: "No responses found"
            });
        }
        else {
            res.json({
                responses: responses,
                length: responses.length
            });
        }
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });

    }
});


// GET form titles for current user

router.get("/titles", authenticate, async (req: RequestWithUser, res): Promise<any> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const forms = await Form.find({ createdBy: userId }).select("title _id");

        if (!forms.length) {
            return res.status(404).json({ message: "No forms found for this user" });
        }

        res.status(200).json({ titles: forms });
    } catch (error) {
        console.error("Error fetching form titles:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});


export const reports = router;
