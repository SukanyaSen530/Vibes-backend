import mongoose from "mongoose";
import User from "./User.js";

const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const Comment = model("comment", CommentSchema);

export default Comment;
