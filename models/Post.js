import mongoose from "mongoose";
import User from "./User.js";

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    content: String,
    images: {
      type: Array,
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Post = model("post", PostSchema);

export default Post;
