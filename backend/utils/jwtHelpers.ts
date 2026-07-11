import jwt from "jsonwebtoken";
import { Response } from "express";
import { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_MAX_AGE } from "../constants/auth.js";

export const generateTokenAndSetCookie = (res: Response, userId: string): void => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: COOKIE_MAX_AGE,
  });
};
