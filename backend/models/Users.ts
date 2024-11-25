import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: number;
  password: string;
  subscription_plan: string;
  role: string; 
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription_plan: {
    type: String,
    default: "free",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  }, 
});

export default mongoose.model<IUser>("User", UserSchema);


