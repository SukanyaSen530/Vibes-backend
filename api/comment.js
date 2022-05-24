import express from "express";
import {
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getComments,
} from "../controllers/comment.js";

const commentRoutes = express.Router();

commentRoutes.get("/:postId", getComments);
commentRoutes.post("/", addComment);
commentRoutes.put("/:commentId", updateComment);
commentRoutes.delete("/:commentId/:postId", deleteComment);
commentRoutes.put("/like/:commentId", likeComment);
commentRoutes.put("/dislike/:commentId", dislikeComment);

export default commentRoutes;
