import express from "express";
import {
  getUserProfile,
  searchUser,
  updateUserPassword,
  updateUserDetails,
  updateUserDetails,
  followUser,
  unfollowUser,
  suggestionsUser,
} from "../controllers/user.js";

const userRoutes = express.Router();

userRoutes.get("/:userId", getUserProfile);
userRoutes.get("/search", searchUser);
userRoutes.post("/updatepassword", updateUserPassword);
userRoutes.put("/updatedetails", updateUserDetails);
userRoutes.patch("/follow/:userFollowId", followUser);
userRoutes.patch("unfollow/:userFollowId", unfollowUser);
userRoutes.get("/suggestionsUser", suggestionsUser);

export default authRoutes;
