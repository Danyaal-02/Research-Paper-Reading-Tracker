import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

export const generateTokenAndSetCookie = (res: Response, userId: Types.ObjectId): void => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
