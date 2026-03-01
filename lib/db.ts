import mongoose from "mongoose";
import dns from "dns";

// 🚀 THE ULTIMATE BYPASS: Ye Node.js ko naye network me atakne se rokega
dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI!;

// ... (baaki ka poora code same rahega)
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, 
      family: 4, // 🚀 THE MAGIC FIX: Ye line Node.js ko IPv4 use karne pe majboor karegi
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Database Connected Successfully!");
      return mongoose;
    }).catch((error) => {
      console.error("❌ DB Connection Blocked by Network.");
      cached.promise = null;
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};