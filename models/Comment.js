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
    likes: [{ type: mongoose.Types.ObjectId, ref: User }],
    user: { type: mongoose.Types.ObjectId, ref: User },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const Comment = model("comment", CommentSchema);

export default Comment;
