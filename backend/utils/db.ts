import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://Aditya:adpandey@cluster0.h40tx.mongodb.net/React_port_book?retryWrites=true&w=majority"; // Replace with your MongoDB connection string

export const connectDB = async (): Promise<void> => {   
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};
