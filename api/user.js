import express from "express";
import {
  getUserProfile,
  searchUser,
  updateUserPassword,
  updateUserDetails,
  followUser,
  unfollowUser,
  suggestionsUser,
} from "../controllers/user.js";

const userRoutes = express.Router();


userRoutes.get("/search", searchUser);
userRoutes.post("/updatepassword", updateUserPassword);
userRoutes.put("/updatedetails", updateUserDetails);
userRoutes.put("/follow/:userFollowId", followUser);
userRoutes.put("/unfollow/:userFollowId", unfollowUser);
userRoutes.get("/suggestionsUser", suggestionsUser);
userRoutes.get("/:userId", getUserProfile);

export default userRoutes;
