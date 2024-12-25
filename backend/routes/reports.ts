import { Request, Response, Router } from "express";
import * as XLSX from 'xlsx';
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



// Function to convert form data and responses to XLSX

// Helper function to convert form and responses into an XLSX buffer
async function convertToXlsx(form: any, responses: any[]): Promise<Buffer> {
    const workbook = XLSX.utils.book_new();

    if (!form.questions || !Array.isArray(form.questions)) {
        throw new Error("Invalid form structure: 'questions' not found or not an array.");
    }

    const headers: string[] = [];
    const data: any[] = [];

    form.questions.forEach((question: any) => {
        if (question.type === "matrix") {
            question.rows.forEach((row: string) => {
                question.columns.forEach((column: string) => {
                    headers.push(`${question.questionText} (${row} - ${column})`);
                });
            });
        } else {
            headers.push(question.questionText);
        }
    });

    responses.forEach((response: any) => {
        const rowData: string[] = [];

        form.questions.forEach((question: any) => {
            const answer = response.responses.find(
                (r: any) => String(r.questionId) === String(question._id)
            );

            if (answer) {
                if (question.type === "matrix") {
                    question.rows.forEach((row: string) => {
                        question.columns.forEach((column: string) => {
                            const cell = answer.answer.find(
                                (a: any) => a.row === row && a.column === column
                            );
                            rowData.push(cell ? JSON.stringify(cell.value) : "N/A");
                        });
                    });
                } else if (typeof answer.answer === "object") {
                    // Serialize non-matrix object answers to JSON
                    rowData.push(JSON.stringify(answer.answer));
                } else {
                    rowData.push(
                        Array.isArray(answer.answer)
                            ? answer.answer.join(", ")
                            : answer.answer || "N/A"
                    );
                }
            } else {
                if (question.type === "matrix") {
                    question.rows.forEach(() => {
                        question.columns.forEach(() => {
                            rowData.push("N/A");
                        });
                    });
                } else {
                    rowData.push("N/A");
                }
            }
        });

        data.push(rowData);
    });

    console.log("Headers:", headers);
    console.log("Data Rows:", data);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}


// API endpoint to export form responses to XLSX
router.get(
    "/forms/:formId/export/xlsx",
    authenticate,
    async (req: any, res: Response): Promise<any> => {
        try {
            const userId = req.user?._id;
            const formId = req.params.formId;

            if (!userId) {
                return res.status(401).json({ message: "Authentication required." });
            }

            if (!formId) {
                return res.status(400).json({ message: "Form ID is required." });
            }

            // Fetch form and responses
            const form = await Form.findOne({ _id: formId, createdBy: userId });
            if (!form) {
                return res.status(404).json({ message: "Form not found." });
            }

            const responses = await ResponseModel.find({ formId });
            if (!responses.length) {
                return res
                    .status(404)
                    .json({ message: "No responses found for this form." });
            }

            // Convert to XLSX
            const xlsxBuffer = await convertToXlsx(form, responses);

            // Set headers for XLSX download
            const filename = `${form.title || "form"}_responses.xlsx`;
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

            // Send XLSX file
            res.send(xlsxBuffer);
        } catch (error: any) {
            console.error("Error exporting responses:", error.message);
            res.status(500).json({ message: "Internal server error.", error: error.message });
        }
    }
);


// GET all looged users from the form
router.get(
    "/forms/:formId/users",
    authenticate,
    async (req: RequestWithUser, res): Promise<any> => {
      try {
        const { formId } = req.params;``

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
