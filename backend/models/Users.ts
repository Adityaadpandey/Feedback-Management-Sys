import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: number;
  subscription_plan: string;
  subscription_expiry?: Date;
  role: string;
  clerkId: string; // Unique identifier from Clerk
  isActive: boolean;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true, // Ensures one-to-one mapping with Clerk
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true, // Ensures email is stored in lowercase
    },
    phone: {
      type: Number,
      validate: {
        validator: function (v: number) {
          return /^\d{10}$/.test(v.toString()); // Validates a 10-digit phone number
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    subscription_plan: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },
    subscription_expiry: {
      type: Date,
      default: null, // Used for premium subscriptions
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export default mongoose.model<IUser>("User", UserSchema);
