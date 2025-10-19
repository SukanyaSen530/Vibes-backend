import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "vibes",
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URL, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected:", mongoose.connection.host);
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        throw new Error("MongoDB Connection Error");
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
