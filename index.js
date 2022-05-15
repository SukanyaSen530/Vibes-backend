import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./api/auth.js";

//for accessing the .env file
dotenv.config();

const app = express();

//connecting to mongoDB
connectDB();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Vibes Backend!"));
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, (err) => {
  const port = server.address().port;
  if (err) console.log("Error in server setup");
  console.log(`Server running on ${port}`);
});

export default app;
