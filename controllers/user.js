import User from "../models/User.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate(
      "followers followings",
      "avatar username fullName followers followings"
    );

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });

    return res.status(200).json({ success: true, userProfile: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const searchUser = async (req, res) => {
  const { username } = req.query;

  try {
    const users = await User.find({
      userName: { $regex: username },
    })
      .limit(10)
      .select("fullName userName avatar");

    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const updateUserPassword = async (req, res) => {
  const { password, newPassword } = req.body;

  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("+password");

    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res
        .status(401)
        .send({ success: false, message: "Password does not match" });

    user.password = newPassword;

    await user.save();

    return res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  const { fullName, bio, website } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    let output;

    if (req.files?.avatar) {
      if (user.avatar.id) await cloudinary.uploader.destroy(user.avatar.id);

      output = await cloudinary.uploader.upload(
        req.files.avatar?.tempFilePath,
        {
          folder: "vibes/vibes-avatars",
        }
      );
    }

    const avatar = {
      id: output?.public_id,
      secure_url: output?.secure_url,
    };

    if (req.files?.banner) {
      if (user.banner.id) await cloudinary.uploader.destroy(user.banner.id);

      output = await cloudinary.uploader.upload(
        req.files.banner?.tempFilePath,
        {
          folder: "vibes/vibes-banners",
        }
      );
    }

    const banner = {
      id: output?.public_id,
      secure_url: output?.secure_url,
    };

    const newUser = await User.findByIdAndUpdate(
      user.id,
      {
        fullName: fullName || user.fullName,
        avatar: avatar.id ? avatar : user.avatar,
        banner: banner.id ? banner : user.banner,
        bio,
        website,
      },
      { new: true }
    );

    const userData = await User.findById(newUser._id).populate(
      "followers followings",
      "avatar username fullName followers followings"
    );

    res.status(200).send({ success: true, user: userData });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const followUser = async (req, res) => {
  //loggedInUser
  const userId = req.user._id;
  //user, loggedInUser wants to follow
  const { userFollowId } = req.params;

  try {
    await User.findByIdAndUpdate(
      userFollowId,
      {
        $addToSet: { followers: userId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { followings: userFollowId },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "followed" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ succes: false, message: err.message });
  }
};

export const unfollowUser = async (req, res) => {
  //loggedInUser
  const userId = req.user._id;
  //user, loggedInUser wants to follow
  const { userFollowId } = req.params;

  try {
    await User.findOneAndUpdate(
      { _id: userFollowId },
      {
        $pull: { followers: userId },
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { followings: userFollowId },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "followed" });
  } catch (err) {
    return res.status(500).json({ succes: false, message: err.message });
  }
};

export const suggestionsUser = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  try {
    const newArr = [...user.followings, userId];
    const num = req.query.num || 5;

    const users = await User.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followings",
          foreignField: "_id",
          as: "following",
        },
      },
    ]);

    return res.status(200).json({ succes: true, users });
  } catch (err) {
    return res.status(500).json({ succes: false, message: err.message });
  }
};

