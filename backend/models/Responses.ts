import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
    submittedBy: {
      user_name: {
        type: String,
        ref: "User",
        default: null, // Allows anonymous submissions
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // Allows anonymous submissions
      }
    },

  responses: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Form.questions", // Optional: Reference the question directly
      },
      answer: {
        type: mongoose.Schema.Types.Mixed, // Can store different data types
        required: true,
      },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Response", responseSchema);
