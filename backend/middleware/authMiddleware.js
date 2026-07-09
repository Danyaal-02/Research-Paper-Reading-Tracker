import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes requiring authentication.
 * Extracts JWT from HTTP-only cookie, verifies it, and populates req.user.
 */
const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized — no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — user not found",
      });
    }

    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized — invalid token",
    });
  }
};

export default authMiddleware;
