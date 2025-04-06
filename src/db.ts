import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const password = process.env.MONGODB_PASSWORD;
  try {
    await mongoose.connect(`mongodb+srv://Nishant:${password}@cluster0.udeyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
