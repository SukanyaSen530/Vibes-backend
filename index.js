import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./api/auth.js";
import userRoutes from "./api/user.js";

//middleware
import protectedRoutes from "./middleware/protectedRoutes.js";

//for accessing the .env file
dotenv.config();

const app = express();

//connecting to mongoDB
connectDB();

const corsOptions = {
  // origin: "http://localhost:3000",
  origin:
    "https://vibes-frontend-git-feat-user-details-sukanyasen530.vercel.app/",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use(express.json({ limit: "5mb" }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_PASS,
});


app.get("/", (req, res) => res.send("Vibes Backend!"));
app.use("/auth", authRoutes);
app.use("/user", protectedRoutes, userRoutes);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, (err) => {
  const port = server.address().port;
  if (err) console.log("Error in server setup");
  console.log(`Server running on ${port}`);
});

export default app;
