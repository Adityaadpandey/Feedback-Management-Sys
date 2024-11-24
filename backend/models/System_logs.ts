import mongoose, { Schema } from "mongoose";

export interface ISystemLog extends Document {
  log_id: string;
  action: string; // e.g., "Form Deleted"
  performed_by: string; // Admin performing the action
  details: string;
  timestamp: Date;
}

const SystemLogSchema: Schema = new Schema({
  log_id: {
    type: String,
    unique: true,
  },
  action: {
    type: String,
    required: true,
  },
  performed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  details: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ISystemLog>("SystemLog", SystemLogSchema);
