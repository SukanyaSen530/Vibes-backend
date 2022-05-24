import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
    postId: mongoose.Types.ObjectId,
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);

const Comment = model("comment", CommentSchema);

export default Comment;
