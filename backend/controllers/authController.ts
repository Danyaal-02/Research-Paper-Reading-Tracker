import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/jwtHelpers.js";
import { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

export const signup = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const user = await User.create({ email, passwordHash: password });

  generateTokenAndSetCookie(res, user.id);

  res.status(201).json({
    success: true,
    user: { id: user._id, email: user.email },
  });
});

export const login = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    generateTokenAndSetCookie(res, user.id);
    res.json({
      success: true,
      user: { id: user._id, email: user.email },
    });
  } else {
    throw new AppError("Invalid email or password", 401);
  }
});

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Crucial for HTTPS on Render
    sameSite: "none", // Mandated for cross-origin domain structures
    path: "/"
  });
  
  return res.status(200).json({ 
    success: true, 
    message: "Logged out successfully" 
  });
};

export const getMe = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.user?.id).select("-passwordHash");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({
    success: true,
    user: { id: user._id, email: user.email },
  });
});
