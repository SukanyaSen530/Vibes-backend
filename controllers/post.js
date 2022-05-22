import { v2 as cloudinary } from "cloudinary";
import Post from "../models/Post.js";
import User from "../models/User.js";

//Add comment later
export const getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate(
      "user",
      "avatar userName fullName"
    );

    return res.status(201).send({ success: true, post: post });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ user: userId }).sort("-createdAt");

    return res.status(201).send({ success: true, posts });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Posts of people user follows
export const getAllPosts = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  try {
    const posts = await Post.find({ user: [...user.followings, userId] })
      .sort("-createdAt")
      .populate("user", "avatar userName fullName");

    return res.status(201).send({ success: true, posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Create Posts
export const createPost = async (req, res) => {
  const { description } = req.body;
  const userId = req.user._id;

  let imageArr = req.files?.image;
  const images = [];

  if (!Array.isArray(imageArr)) {
    imageArr = [imageArr];
  }

  try {
    for (let i = 0; i < imageArr?.length; i++) {
      let result = await cloudinary.uploader.upload(imageArr[i]?.tempFilePath, {
        folder: "vibes/vibes-posts",
        height: 300,
        crop: "fit",
      });
      images.push({ id: result?.public_id, secure_url: result.secure_url });
    }

    const newPost = new Post({
      description,
      images,
      user: userId,
    });

    await newPost.save();

    return res.status(201).send({ success: true, post: newPost });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { description } = req.body;
  const { postId } = req.params;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        description,
      },
      { new: true }
    );
    res.status(200).send({ success: true, post: updatedPost });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  const images = post?.images;

  try {
    for (let i = 0; i < images?.length; i++) {
      await cloudinary.uploader.destroy(images[i].id);
    }

    //Delete from saved of users
    await User.updateMany({}, { $pull: { saved: postId } });

    await Post.findByIdAndDelete(postId);

    return res.status(200).send({ success: true, id: postId });
  } catch (err) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = Post.findById(postId);

  if (!post)
    return res.status(404).json({
      success: false,
      message: "The post you are trying to save, must be deleted!",
    });

  try {
    await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: userId },
      },
      { new: true }
    );

    return res.status(200).send({ success: true, message: "Post liked!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const dislikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const likedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );

    if (!likedPost)
      return res
        .status(400)
        .json({ success: false, message: "This post does not exist." });

    return res
      .status(200)
      .send({ success: true, message: "Post removed from liked!" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const likedPosts = await Post.find({ likes: userId }).sort("-createdAt");

    return res.status(200).send({ success: true, likedPosts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: err.message });
  }
};

export const savePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = Post.findById(postId);

  if (!post)
    return res.status(404).json({
      success: false,
      message: "The post you are trying to save, must be deleted!",
    });

  try {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { saved: postId } },
      { new: true }
    );

    return res
      .status(200)
      .send({ success: true, message: "Post saved!", postId });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

export const unsavePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { saved: postId },
      },
      { new: true }
    );

    return res
      .status(200)
      .send({ success: true, message: "Post removed from saved!", postId });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

export const getSavedPosts = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  try {
    const savedPosts = await Post.find({ _id: { $in: [...user.saved] } }).sort(
      "-createdAt"
    );

    return res.status(200).send({ success: true, savedPosts });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

export const discoverPosts = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  try {
    const users = [...user.followings, userId];

    const posts = await Post.aggregate([
      { $match: { user: { $nin: users } } },
    ]).sort("-createdAt");

    return res.status(200).send({ success: true, posts });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
