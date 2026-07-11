import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/jwtHelpers.js";
import { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

export const signup = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError(AUTH_MESSAGES.USER_EXISTS, 400);
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
  _next: NextFunction
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
    throw new AppError(AUTH_MESSAGES.INVALID_LOGIN, 401);
  }
});

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Crucial for HTTPS on Render
    sameSite: "none", // Mandated for cross-origin domain structures
    path: "/"
  });
  
  return res.status(200).json({ 
    success: true, 
    message: AUTH_MESSAGES.LOGOUT_SUCCESS 
  });
};

export const getMe = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const user = await User.findById(req.user?.id).select("-passwordHash");
  if (!user) {
    throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, 404);
  }
  res.json({
    success: true,
    user: { id: user._id, email: user.email },
  });
});
