import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";

export const errorHandler = (
  err: Error & { statusCode?: number } | unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = "Server Error";
  let stack = undefined;

  if (err instanceof Error) {
    statusCode = (err as any).statusCode || statusCode;
    message = err.message || message;
    stack = err.stack;
  }

  logger.error(stack || message, { context: "ErrorHandler" });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack }),
  });
};
