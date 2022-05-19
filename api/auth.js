import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  generateAccessToken,
  logoutUser,
} from "../controllers/auth.js";

const authRoutes = express.Router();

authRoutes.post("/signin", loginUser);
authRoutes.post("/signup", registerUser);
authRoutes.post("/forgotpassword", forgotPassword);
authRoutes.put("/reset/password/:token", resetPassword);
authRoutes.get("/refreshToken", generateAccessToken);
authRoutes.get("/logout", logoutUser);


export default authRoutes;
