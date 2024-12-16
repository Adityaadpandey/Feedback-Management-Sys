import { Router } from "express";
import { body, validationResult } from "express-validator";
import { authenticate } from "../middleware/authenticator"; // Your authentication middleware
import Form from "../models/Form"; // Your Form model

const router = Router();

// form creation with validation
router.post(
  "/create",
  authenticate,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("questions").isArray().withMessage("Questions must be an array"),
    body("questions.*.questionText")
      .notEmpty()
      .withMessage("Each question must have text"),
    body("questions.*.questionType")
      .isIn([
        "short-answer",
        "paragraph",
        "multiple-choice",
        "checkbox",
        "dropdown",
        "file-upload",
        "date",
        "time",
        "rating",
        "linear-scale",
        "matrix",
      ])
      .withMessage("Invalid question type"),
    body("questions.*.options")
      .optional()
      .isArray()
      .withMessage("Options must be an array for multiple-choice and similar question types"),
  ],
  async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Use the authenticated user's ID
      const { _id: userId } = req.user._id;   // from authenticate middleware

      const {
        title,
        description,
        questions,
        collaborators,
        theme,
        isPublic,
        responseLimit,
        timer,
      } = req.body;

      // Create a new form
      const newForm = new Form({
        title,
        description,
        createdBy: userId, // Use authenticated user's ID as `createdBy`
        collaborators,
        theme,
        isPublic,
        responseLimit,
        timer,
        questions,
      });

      // Save the form to the database
      await newForm.save();

      res.status(201).json({
        message: "Form created successfully",
        form: newForm,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
        error,
      });
    }
  }
);


// Get form by ID and share it
router.get('/get/:id', async (req, res):Promise<any> => {
    try {
        const { id } = req.params;
        const form = await Form.findById(id);

        // Check if form exists

        if (!form) {
            return res.status(404).json({
                message: "Form not found"
            });
        }
        // Check if form is public
        if (!form.isPublic) {
            return res.status(403).json({
                message: "Form is not public"
            });
        }
        // Return the form
        res.json(form);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
});


// Update form by ID
router.put('/update/:id', authenticate, async (req:any, res):Promise<any> => {
    try {
        const { id } = req.params;
        const form = await Form.findById(id);
        const { _id: userId } = req.user;  // from authenticate middleware

        // Check if form exists
        if (!form) {
            return res.status(404).json({
                message: "Form not found"
            });
        }
        // Check if the user is the creator of the form
        if (form.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this form"
            });
        }
        // Update the form
        const updatedForm = await Form
            .findByIdAndUpdate(id, req
                .body, { new: true });
        res.json(updatedForm);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}
);


export const form = router;
