import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import User from "../models/User.js";
import { JWT_SECRET } from "../constants/auth.js";
import { AppError } from "../utils/AppError.js";
import { AuthRequest } from "../types/index.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError(AUTH_MESSAGES.AUTH_NO_TOKEN, 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as { id: string };
    
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return next(new AppError(AUTH_MESSAGES.AUTH_USER_NOT_FOUND, 401));
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(new AppError(AUTH_MESSAGES.AUTH_TOKEN_FAILED, 401));
  }
};
