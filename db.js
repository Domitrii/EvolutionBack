import "dotenv/config";
import "./db.js";  
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set");
} else {
  mongoose
    .connect(MONGODB_URI, { autoIndex: true })
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err);
    });
}

export default mongoose;