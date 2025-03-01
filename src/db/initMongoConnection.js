import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


export const initMongoConnection = async () => {
  try {
    const mongoURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(mongoURI);
    console.log("MongoDB connection established successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};