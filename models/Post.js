import mongoose from "mongoose";
import User from "./User.js";
import Comment from "./Comment.js";

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    content: { type: String, required: true },
    images: [
      { id: { type: String }, secure_url: { type: String }, required: true },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: User }],
    user: { type: Schema.Types.ObjectId, ref: User },
    comments: [{ type: mongoose.Types.ObjectId, ref: Comment }],
  },
  {
    timestamps: true,
  }
);

const Post = model("post", PostSchema);

export default Post;
