import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('⚠️ FATAL ERROR: MONGODB_URI is missing in environment variables.');
}

// Enterprise Singleton Pattern (Caches the connection)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn; // Agar pehle se connected hai, toh wahi use karo (Super Fast)
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents hanging requests
      maxPoolSize: 100, // Handles 100 concurrent enterprise requests
      serverSelectionTimeoutMS: 5000, 
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('🔗 [ENTERPRISE NODE] MongoDB Connected Successfully');
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;