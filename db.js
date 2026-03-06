import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set");
  process.exit(1);
}

const connectPromise = mongoose
  .connect(MONGODB_URI, { autoIndex: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return mongoose;
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

export default mongoose;
export { connectPromise };