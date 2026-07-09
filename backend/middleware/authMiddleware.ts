import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User.js";

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
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as { id: string };
    
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      res.status(401);
      return next(new Error("Not authorized, user not found"));
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};
