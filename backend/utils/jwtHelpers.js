import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for the given user ID.
 * @param {string} userId - The MongoDB user ID
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Set JWT token as an HTTP-only cookie on the response.
 * @param {import('express').Response} res - Express response object
 * @param {string} token - JWT token string
 */
export const setTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Clear the JWT cookie from the response.
 * @param {import('express').Response} res - Express response object
 */
export const clearTokenCookie = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
