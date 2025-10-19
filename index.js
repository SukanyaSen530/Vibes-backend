import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import helmet from "helmet";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./api/auth.js";
import userRoutes from "./api/user.js";
import postRoutes from "./api/post.js";
import commentRoutes from "./api/comment.js";

//middleware
import protectedRoutes from "./middleware/protectedRoutes.js";

//for accessing the .env file
dotenv.config();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"];

//connecting to mongoDB
connectDB().catch((err) => console.error("Initial DB connection failed:", err));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(helmet());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_PASS,
});

app.get("/", (req, res) => res.send("Vibes Backend!"));
app.use("/auth", authRoutes);
app.use("/user", protectedRoutes, userRoutes);
app.use("/post", protectedRoutes, postRoutes);
app.use("/comment", protectedRoutes, commentRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
