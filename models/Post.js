import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    description: { type: String, required: true },
    images: [
      {
        id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true,
  }
);

const Post = model("post", PostSchema);

export default Post;
