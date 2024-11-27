import { Router } from "express";
import { body, validationResult } from "express-validator";
import authenticate from "../middleware/authenticator"; // Your authentication middleware
import Form from "../models/Form"; // Your Form model

const router = Router();

// Create form endpoint
router.post(
  "/create",
  authenticate, // Ensure the user is authenticated
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
      const { _id: userId } = req.user;

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


export const form = router;
