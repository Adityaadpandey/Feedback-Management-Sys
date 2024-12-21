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
    ai_generation: number;
    ai_generation_limit: number;
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
                // Only validate the phone number if it's not null or undefined
                validator: function (v: number) {
                    if (v === null || v === undefined) return true; // Allow null or undefined
                    return /^\d{10}$/.test(v.toString()); // Validates a 10-digit phone number
                },
                message: (props: any) => `${props.value} is not a valid phone number!`,
            },
            required: false, // Make sure the field is not required
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
            enum: ["user", "admin_v3", "admin_v7", "admin_10"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        ai_generation: {
            type: Number,
            default: 0,
        },
        ai_generation_limit: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to set ai_generation_limit based on the role before saving the user
UserSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('role')) {
        // Set AI generation limit based on the user's role
        switch (this.role) {
            case 'admin_v3':
                this.ai_generation_limit = 3;
                break;
            case 'admin_v7':
                this.ai_generation_limit = 7;
                break;
            case 'admin_10':
                this.ai_generation_limit = 10;
                break;
            default:
                this.ai_generation_limit = 0;
                break;
        }
    }
    next();
});

// Create a model from the schema
export default mongoose.model<IUser>("User", UserSchema);
