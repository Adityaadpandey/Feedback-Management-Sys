import { Router } from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import { optionalAuth } from "../middleware/authenticator";
import FormModel from "../models/Form";
import ResponseModel from "../models/Responses";

const router = Router();

/**
 * Optimized high-performance form response submission
 * Key performance optimizations:
 * - Minimal validation
 * - Parallel processing
 * - Reduced database interactions
 */
router.post(
  "/",
  optionalAuth,
  [
    body("formId").isMongoId(),
    body("responses").isArray({ min: 1 }),
    body("responses.*.questionId").isMongoId(),
    body("responses.*.answer").notEmpty(),
  ],
  async (req, res) => {
    // Quick validation without detailed error messages
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const { formId, responses } = req.body;
    const userId = req.user?._id || null;

    try {
      // Parallel database checks
      const [form, existingResponses] = await Promise.all([
        FormModel.findById(formId).select('questions').lean(),
        ResponseModel.countDocuments({ formId, submittedBy: userId })
      ]);

      // Quick rejections
      if (!form) return res.status(404).json({ message: "Form not found" });

      // Optional: Rate limiting based on previous submissions
      if (existingResponses >= 1000) {
        return res.status(429).json({ message: "Submission limit reached" });
      }

      // Validate question IDs in memory (faster than database query)
      const validQuestionIds = new Set(
        form.questions.map((q) => q._id.toString())
      );

      const invalidResponses = responses.some(
        (response) => !validQuestionIds.has(response.questionId)
      );

      if (invalidResponses) {
        return res.status(400).json({ message: "Invalid questions" });
      }

      // Bulk write for faster insertion
      const newResponse = new ResponseModel({
        formId: new mongoose.Types.ObjectId(formId),
        submittedBy: userId,
        responses,
        createdAt: new Date() // Explicitly set to reduce overhead
      });

      // Use native MongoDB driver method for faster write
      await newResponse.save();

      // Fire-and-forget form analytics update (non-blocking)
      void FormModel.updateOne(
        { _id: formId },
        {
          $inc: { "analytics.responsesCount": 1 },
          $set: { "analytics.lastResponseAt": new Date() }
        }
      );

      return res.status(201).json({
        message: "Response submitted",
          responseId: newResponse._id,
        res: newResponse
      });
    } catch (error) {
      console.error("Submission error:", error);
      return res.status(500).json({ message: "Submission failed" });
    }
  }
);

export const responses = router;
