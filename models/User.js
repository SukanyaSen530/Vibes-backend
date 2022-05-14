import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullName is required!"],
    },

    userName: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, "Username already exists"],
      required: [true, "Username is required!"],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, "email already exists!"],
      required: [true, "email is required!"],
    },

    role: {
      type: "String",
      enum: ["user", "admin"],
      default: "user",
    },

    password: {
      type: String,
      required: [true, "password is required!"],
      minlength: [6, "password must be min 6 characters long!"],
      trim: true,
      select: false,
    },

    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/weebofigurines/image/upload/v1652435941/vibes/defaultAvatar.png",
    },

    banner: {
      type: String,
      default:
        "https://res.cloudinary.com/weebofigurines/image/upload/v1652516344/vibes/defaultBg.jpg",
    },

    bio: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    followers: [mongoose.Schema.Types.ObjectId],
    followings: [mongoose.Schema.Types.ObjectId],
    liked: [{ type: mongoose.Schema.Types.ObjectId }],
    saved: [{ type: mongoose.Types.ObjectId }],

    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

//Password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Unhashing password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generating JWT Token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

// generate forgot password token (string)
UserSchema.methods.getForgotPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  // 20 minuets

  return token;
};

const User = model("user", UserSchema);

export default User;
