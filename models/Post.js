import mongoose from "mongoose";
import User from "./User.js";

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    content: { type: String, required: true },
    images: {
      type: Array,
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
    // comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true,
  }
);

const Post = model("post", PostSchema);

export default Post;
