import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
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
    questions: [{
        type: mongoose.Schema.Types.Mixed
    }], // Reuse question schema structure
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Template", templateSchema);
