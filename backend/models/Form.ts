import mongoose, { Document, Schema } from "mongoose";

export interface IField {
  field_id: string;
  type: string;
  label: string;
}

export interface IForm extends Document {
  title: string;
  description: string;
  owner_id: string;
  fields: IField[];
  status: string;
}

const FormSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fields: [
    {
      field_id: String,
      type: String,
      label: String,
    },
  ],
  status: {
    type: String,
    default: "draft",
  },
});

export default mongoose.model<IForm>("Form", FormSchema);
