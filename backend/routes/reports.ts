import { Request, Router } from "express";
import { authenticate } from "../middleware/authenticator";
import Form from "../models/Form";
import ResponseModel from "../models/Responses";
import Users from "../models/Users";

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

router.get("/form/:id", authenticate, async (req, res): Promise<any> => {
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

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Fetch form titles created by the user with optimized query
        const forms = await Form.find({ createdBy: userId }, "title _id").lean().exec();

        // Return 404 if no forms are found
        if (!forms.length) {
            return res.status(404).json({ message: "No forms found" });
        }

        // Send the response immediately
        res.status(200).json({ titles: forms });

    } catch (error) {
        console.error("Error fetching form titles:", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});


// Get the CSV file for the form
router.get("/forms/:formId/export/csv", authenticate, async (req: RequestWithUser, res): Promise<any> => {
    try {
        const { formId } = req.params;
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }
        const responses = await ResponseModel.find({ formId }).lean().exec();
        if (!responses.length) {
            return res.status(404).json({ message: "No responses found" });
        }
        // Prepare CSV data

        const fields = Object.keys(responses[0]);
        const csv = responses.map((response) => fields.map((field) => response[field]).join(","));
        // Set the response headers
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=responses-${form.title}.csv`);
        // Send the CSV data
        res.status(200).send(csv.join("\n"));
    } catch (error) {
        console.error("Error exporting responses:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
);


// GET all looged users from the form
router.get(
    "/forms/:formId/users",
    authenticate,
    async (req: RequestWithUser, res): Promise<any> => {
      try {
        const { formId } = req.params;

        // Check if the form exists
        const form = await Form.findById(formId);
        if (!form) {
          return res.status(404).json({ message: "Form not found" });
        }

        // Fetch all responses for the form
        const responses = await ResponseModel.find({ formId })
          .lean()
          .exec();
        if (!responses.length) {
          return res.status(404).json({ message: "No responses found" });
        }

        // Extract `user_id` from `submittedBy` for authenticated submissions
        const userIds = responses
          .map((response) => response.submittedBy?.user_id)
          .filter((id) => id); // Filter out null/undefined values

        if (!userIds.length) {
          return res
            .status(404)
            .json({ message: "No authenticated users found in responses" });
        }

        // Fetch user details
        const users = await Users.find({ _id: { $in: userIds } }, "name email")
          .lean()
          .exec();

        if (!users.length) {
          return res.status(404).json({ message: "No users found" });
        }

        // Respond with user details
        res.json(users);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }
    }
  );



// Get the JSON file for the form
router.get("/forms/:formId/export/json", authenticate, async (req: RequestWithUser, res): Promise<any> => {
    try {
        const { formId } = req.params;
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }
        const responses = await ResponseModel.find({ formId }).lean().exec();
        if (!responses.length) {
            return res.status(404).json({ message: "No responses found" });
        }
        // Prepare JSON data
        res.json(responses);
    } catch (error) {
        console.error("Error exporting responses:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})


router.get("/forms/:formId/responses/count", authenticate, async (req: RequestWithUser, res): Promise<any> => {
    try {
        const { formId } = req.params;
        const count = await ResponseModel.countDocuments
            ({ formId });
        res.json({ count });
    } catch (error) {
        console.error("Error counting responses:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
);



export const reports = router;
