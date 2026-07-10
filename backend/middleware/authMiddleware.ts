import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User.js";
import { JWT_SECRET } from "../constants/auth.js";
import { AppError } from "../utils/AppError.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as { id: string };
    
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return next(new AppError("Not authorized, user not found", 401));
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Not authorized, token failed", 401));
  }
};
