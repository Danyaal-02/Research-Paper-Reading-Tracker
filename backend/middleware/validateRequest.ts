import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Allow schema validation methods to pass
      if (schema && typeof schema.parse === 'function') {
         // Using zod
         req.body = schema.parse(req.body);
      }
      next();
    } catch (error: any) {
      res.status(400);
      if (error.errors) {
        // Zod error format
        next(new Error(error.errors.map((e: any) => e.message).join(", ")));
      } else {
        next(error);
      }
    }
  };
};
