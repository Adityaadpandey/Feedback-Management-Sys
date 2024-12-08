import { Router } from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import { optionalAuth } from "../middleware/authenticator"; // Optional authentication middleware
import FormModel from "../models/Form"; // Form model
import ResponseModel from "../models/Responses"; // Response model

const router = Router();

/**
 * POST /responses
 * Handles submission of form responses.
 */
router.post(
  "/",
  optionalAuth, // Optional authentication
  [
    body("formId").notEmpty().withMessage("Form ID is required"),
    body("responses").isArray().withMessage("Responses must be an array"),
    body("responses.*.questionId")
      .notEmpty()
      .withMessage("Each response must include a questionId")
      .isMongoId()
      .withMessage("Invalid questionId format"),
    body("responses.*.answer")
      .notEmpty()
      .withMessage("Each response must include an answer"),
  ],
  async (req, res) => {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { formId, responses } = req.body;
      const userId = req.user?._id || null; // Get userId if authenticated, else null

      // Check if the form exists
      const form = await FormModel.findById(formId);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }

      // Validate each questionId against the form's questions
      const validQuestionIds = form.questions.map((q) => q._id.toString()); // Extract valid question IDs
      const invalidResponses = responses.filter(
        (response: { questionId: string }) =>
          !validQuestionIds.includes(response.questionId)
      );

      if (invalidResponses.length > 0) {
        return res.status(400).json({
          message: "Invalid questionId(s) in responses",
          invalidResponses,
        });
      }

      // Create and save the response
      const newResponse = new ResponseModel({
        formId: new mongoose.Types.ObjectId(formId),
        submittedBy: userId, // Null for anonymous submissions
        responses,
      });

      await newResponse.save();

      // Update form's analytics
      form.analytics.responsesCount += 1;
      form.analytics.lastResponseAt = new Date();
      await form.save();

      return res.status(201).json({
        message: "Response submitted successfully",
        response: newResponse,
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);


export const responses = router;
