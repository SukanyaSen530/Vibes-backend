import express from "express";
import {
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getComments,
} from "../controllers/comment.js";

const authRoutes = express.Router();

authRoutes.get("/:postId", getComments);
authRoutes.post("/", addComment);
authRoutes.put("/:commentId", updateComment);
authRoutes.delete("/:commentId", deleteComment);
authRoutes.put("/like/:commentId", likeComment);
authRoutes.put("/dislike/:commentId", dislikeComment);

export default authRoutes;
