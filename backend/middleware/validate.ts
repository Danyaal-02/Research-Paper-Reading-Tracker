import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Send a structured 400 bad request error with the first validation error message
        const message = (error as any).errors.map((e: any) => e.message).join(", ");
        return next(new AppError(message, 400));
      }
      return next(error);
    }
  };
};
