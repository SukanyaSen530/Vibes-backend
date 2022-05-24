import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId: postId })
      .sort({
        createdAt: -1,
      })
      .populate("user", "avatar userName");

    return res
      .status(200)
      .json({ success: true, comments: comments ? comments : [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  const userId = req.user._id;

  try {
    const { postId, content, parentId } = req.body;

    const post = await Post.findById(postId);
    if (!post)
      return res.status(400).json({ msg: "This post does not exist." });

    const newComment = new Comment({
      user: userId,
      content,
      postId,
      parentId: parentId ? parentId : null,
    });

    await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { comments: newComment._id },
      },
      { new: true }
    );

    await newComment.save();

    return res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId, postId } = req.params;

  try {
    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    return res.status(200).json({ success: true, id: commentId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content,
      },
      { new: true }
    );

    return res.status(200).json({ success: true, comment: updatedComment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    await Comment.findByIdAndUpdate(
      commentId,
      {
        $addToSet: { likes: userId },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Liked" });
  } catch (err) {
    console.log("like", err);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const dislikeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    await Comment.findByIdAndUpdate(
      commentId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Disliked comment" });
  } catch (err) {
    console.log("dislike", err);
    return res.status(500).json({ success: false, message: error.message });
  }
};
