import { clerkMiddleware } from "@clerk/express";
import { Router } from "express";
import { body, validationResult } from "express-validator";
import Form from "../models/Form"; // Your Form model

const router = Router();

// Create form endpoint
router.post(
  "/create",
  clerkMiddleware(), // Ensure the user is authenticated
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
      .withMessage(
        "Options must be an array for multiple-choice and similar question types"
      ),
    body("theme")
      .optional()
      .isObject()
      .withMessage("Theme should be an object")
      .bail()
      .custom((value) => {
        if (value?.color && typeof value.color !== "string") {
          throw new Error("Color should be a valid string");
        }
        if (value?.font && typeof value.font !== "string") {
          throw new Error("Font should be a valid string");
        }
        if (value?.background && typeof value.background !== "string") {
          throw new Error("Background should be a valid string or URL");
        }
        return true;
      }),
    body("isPublic")
      .optional()
      .isBoolean()
      .withMessage("isPublic should be a boolean"),
    body("responseLimit")
      .optional()
      .isInt({ min: 0 })
      .withMessage(
        "Response limit should be a positive integer or zero for unlimited responses"
      ),
    body("timer").optional().isInt().withMessage("Timer should be in seconds"),
  ],
  async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get the userId (clerkId) from Clerk middleware
      const clerkId = req.header?.userId;
  
      if (!clerkId) {
        return res.status(401).json({
          message: "Unauthorized. ClerkId is missing.",
        });
      }
  
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
        createdBy: clerkId, // Set the `createdBy` field to the authenticated user's ID
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
  });
  

export const form = router;