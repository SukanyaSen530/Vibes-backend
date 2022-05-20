import express from "express";
import {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  getAllPosts,
  likePost,
  dislikePost,
  savePost,
  unsavePost,
  getSavedPosts,
  getLikedPosts,
} from "../controllers/post.js";

const postRoutes = express.Router();

postRoutes.get("/", getAllPosts);
postRoutes.get("/user_posts/:userId", getUserPosts);
postRoutes.post("/", createPost);
postRoutes.put("/:postId", updatePost);
postRoutes.put("/:postId", deletePost);

postRoutes.put("/like/:postId", likePost);
postRoutes.put("/dislike/:postId", dislikePost);
postRoutes.get("/liked_posts", getLikedPosts);

postRoutes.put("/save/:postId", savePost);
postRoutes.put("/unsave/:postId", unsavePost);
postRoutes.get("/saved_posts", getSavedPosts);

export default postRoutes;
