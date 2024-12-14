import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }], // For real-time collaboration
  theme: {
    color: {
      type: String,
      default: "#ffffff"
    },
    font: {
      type: String,
      default: "Arial"
    },
    background: {
      type: String
    }, // URL or base64
  },
  isPublic: {
    type: Boolean,
    default: false
  }, // Public or restricted access
  responseLimit: {
    type: Number,
    default: 0
  }, // 0 means unlimited responses
  timer: { type: Number }, // In seconds, optional for timed forms
  questions: [
    {
      questionText: {
        type: String,
        required: true
      },
      questionType: {
        type: String,
        enum: [
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
        ],
        required: true,
      },
      options: [{
        type: String
      }], // For multiple-choice, dropdown, checkbox, etc.
      validations: {
        required: {
          type: Boolean,
          default: false
        },
        minLength: { type: Number },
        maxLength: { type: Number },
        regex: { type: String },
      },
      conditionalLogic: {
        condition: { type: String }, // Example: "equals", "contains"
        value: { type: String }, // Example: "Yes"
        targetQuestionId: { type: mongoose.Schema.Types.ObjectId }, // Question to show/hide
      },
    },
  ],
  analytics: {
    responsesCount: { type: Number, default: 0 },
    lastResponseAt: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default module.exports = mongoose.model("Form", formSchema);
