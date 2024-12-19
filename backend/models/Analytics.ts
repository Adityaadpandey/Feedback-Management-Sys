import mongoose, { Document, Schema } from "mongoose";

export interface IAnalytics extends Document {
    formId: mongoose.Types.ObjectId;
    overall: string;
    next_steps: string;
    key_conclusions: string[];
    updatedOn: Date;
}

const AnalyticsSchema: Schema = new Schema<IAnalytics>({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
        required: true,
    },
    overall: {
        type: String,
        required: true,
    },
    next_steps: {
        type: String,
    required: true,
    },
    key_conclusions: {
        type: [String],
        required: true,
    },
    updatedOn: {
        type: Date,
        default: Date.now,
    },
});

// Export the model
export default mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
