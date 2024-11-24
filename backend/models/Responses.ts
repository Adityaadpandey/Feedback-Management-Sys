import mongoose, { Document, Schema } from "mongoose";

export interface IResponse extends Document {
  form_id: string;
  responses: Array<{ field_id: string; answer: string }>;
}

const ResponseSchema: Schema = new Schema({
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  responses: [
    {
      field_id: String,
      answer: String,
    },
  ],
  submitted_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IResponse>("Response", ResponseSchema);
