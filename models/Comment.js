import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Post Id is required"],
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
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
