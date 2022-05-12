import User from "../models/User.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendMail.js";

//for accessing the .env file
dotenv.config();

//REGISTER
export const registerUser = async (req, res) => {
  const newUser = new User(req.body);

  const formattedUsername = newUser.userName
    .trim()
    .toLowerCase()
    .replace(/ /g, "");

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
      .json({ success: false, message: "User already exists!" });

  try {
    const user = await newUser.save();

    sendToken(user._id, 201, res);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//LOGIN
export const loginUser = async (req, res) => {
  const { usernameOremail,  password } = req.body;

  if (!usernameOremail || !password)
    return res
      .status(422)
      .json({ success: false, message: "Please provide Email/Username & Password!" });

  try {
    const user = await User.findOne({ $or: [{ email : usernameOremail},
    { userName: usernameOremail}]}).select("+password");

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
      sendToken(user._id, 200, res);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// RESET PASSWORD EMAIL
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "No email could not be sent" });

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${process.env.BACKEND_URL}passwordreset/${resetToken}`;

    // HTML Message
    const message = `
      <h1> Reset your password for  <strong> Vibes </strong> here!</h1>
      <p> Click on the below link to fill the details! </p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await  sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      return res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res
        .status(404)
        .json({ success: false, message: "Email could not be sent" });
    }
  } catch (err) {
    return next(err);
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid Token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(201).json({
      success: true,
      data: "Password Updated Success",
      token: user.getSignedJwtToken(),
    });

  } catch (err) {
    return next(err);
  }
};

//JWT TOKEN
const sendToken = (id, statusCode, res) => {
  const token = user.getSignedToken();
    
  const user = await User.findById(id)
                .populate('followers followings', 'avatar username fullName followers followings')

  return res
    .status(statusCode)
    .json({ success: true, token, user });
};
