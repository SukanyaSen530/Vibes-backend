import User from "../models/User.js";
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { sendEmail } from "../utils/sendMail.js";

//for accessing the .env file
dotenv.config();

//REGISTER
export const registerUser = async (req, res) => {
  const newUser = new User(req.body);

  const formattedUsername = newUser.userName.replace(/ /g, "");

  const userName = await User.findOne({ userName: formattedUsername });

  if (userName)
    return res.status(400).json({
      success: false,
      message: "Username already exists, choose a new one!",
    });

  const user = await User.findOne({ email: newUser.email });

  if (user)
    return res
      .status(400)
      .json({ success: false, message: "Email is already registered!" });

  try {
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully! Sign in...",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//LOGIN
export const loginUser = async (req, res) => {
  const { emailusername, password } = req.body;

  if (!emailusername || !password)
    return res.status(422).json({
      success: false,
      message: "Please provide valid credentials!",
    });

  try {
    const user = await User.findOne({
      $or: [{ email: emailusername }, { userName: emailusername }],
    }).select("+password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Registered!" });

    //check password matches using method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials!" });
    } else {
      const refresh_token = user.getRefreshToken();

      res.cookie("refreshtoken", refresh_token, {
        path: "/auth/refreshToken",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      sendToken(user, 200, res, req);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// RESET PASSWORD EMAIL
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    const resetPasswordToken = user.getForgotPasswordToken();

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}resetpassword/${resetPasswordToken}`;

    // HTML Message
    const message = `
      <h1> Reset your password for <strong> Vibes </strong> here!</h1>
      <p> Click on the below link to fill the details! </p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      sendEmail({
        to: user.email,
        subject: "Password Reset Request for Vibes",
        text: message,
      });

      return res
        .status(200)
        .json({ success: true, data: "Reset Email sent to user!" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(404).json({
        success: false,
        message: "Email could not be sent to the user!",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const resetToken = req.params.token;

  const { password: newPassword } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(401).json({
        success: false,
        message: "Invalid Reset Token! Time expired...",
      });

    user.password = newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(201).json({
      success: true,
      data: "Password updated success",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Password could not be updated!",
    });
  }
};

//REFRESHTOKEN
export const generateAccessToken = async (req, res) => {
  try {
    const rf_token = req?.cookies?.refreshtoken;

    if (!rf_token)
      return res.status(400).json({
        success: false,
        message: "You have been logged out! Login...",
      });

    jwt.verify(rf_token, process.env.REFRESH_KEY, async (err, result) => {
      if (err)
        return res.status(400).json({
          success: false,
          message: "You have been logged out! Login...",
        });

      const user = await User.findById(result.id);

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "User does not exists!" });
      else {
        sendToken(user, 200, res, req);
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//LOGOUT
export const logoutUser = async (req, res) => {
  try {
    return res
      .clearCookie("refreshtoken", {
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ success: true, message: "Logged out!" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

//JWT TOKEN
const sendToken = async (user, statusCode, res, req) => {
  const token = user.getSignedToken();

  const userData = await User.findById(user._id).populate(
    "followers followings",
    "avatar username fullName followers followings"
  );
  return res.status(statusCode).json({ success: true, token, user: userData });
};

