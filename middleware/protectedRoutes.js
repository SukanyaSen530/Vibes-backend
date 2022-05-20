import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectedRoutes = async function (req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access to route!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not registered!" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access to route!" });
  }
};

export default protectedRoutes;
