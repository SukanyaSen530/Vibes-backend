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
  discoverPosts,
  getPost,
} from "../controllers/post.js";

const postRoutes = express.Router();

postRoutes.get("/", getAllPosts);
postRoutes.get("/user_posts/:userId", getUserPosts);
postRoutes.get("/discover", discoverPosts);
postRoutes.get("/liked_posts", getLikedPosts);
postRoutes.get("/saved_posts", getSavedPosts);
postRoutes.get("/:postId", getPost);

postRoutes.post("/", createPost);
postRoutes.put("/:postId", updatePost);
postRoutes.delete("/:postId", deletePost);

postRoutes.put("/like/:postId", likePost);
postRoutes.put("/dislike/:postId", dislikePost);

postRoutes.put("/save/:postId", savePost);
postRoutes.put("/unsave/:postId", unsavePost);


export default postRoutes;
