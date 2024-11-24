import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  report_id: string;
  reported_by: string; // User who reported
  target_form: string; // The form being reported
  reason: string; // Reason for reporting
  status: string; // 'open', 'resolved', 'dismissed'
}

const ReportSchema: Schema = new Schema({
  report_id: {
    type: String,
    unique: true,
  },
  reported_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  target_form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "resolved", "dismissed"],
    default: "open",
  },
});

export default mongoose.model<IReport>("Report", ReportSchema);
