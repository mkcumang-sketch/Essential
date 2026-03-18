import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("❌ Error: MONGODB_URI is missing in .env file.");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4, // Bypasses Windows/Jio DNS blocks
      serverSelectionTimeoutMS: 5000, 
    };

    console.log("⏳ Connecting to MongoDB vault...");

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ BOOM! DATABASE CONNECTED SUCCESSFULLY!");
      return mongoose;
    }).catch((err) => {
      console.error("❌ MONGODB CONNECTION CRASHED:", err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}