import express from "express";
import { registerUser, loginUser } from "../controllers/auth.js";

const userRoutes = express.Router();

userRoutes.post("/signin", loginUser);
userRoutes.post("/signup", registerUser);

export default userRoutes;
