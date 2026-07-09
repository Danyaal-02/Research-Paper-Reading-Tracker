import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/jwtHelpers.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error("User already exists"));
    }

    const user = await User.create({ email, passwordHash: password });

    generateTokenAndSetCookie(res, user._id as any);

    res.status(201).json({
      success: true,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      generateTokenAndSetCookie(res, user._id as any);
      res.json({
        success: true,
        user: { id: user._id, email: user.email },
      });
    } else {
      res.status(401);
      return next(new Error("Invalid email or password"));
    }
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response): void => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select("-passwordHash");
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }
    res.json({
      success: true,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};
