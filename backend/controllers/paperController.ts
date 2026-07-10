import { Response, NextFunction } from "express";
import Paper from "../models/Paper.js";
import { generateAnalytics } from "../services/analyticsService.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { findPapersByUser } from "../services/paperService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

export const addPaper = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const paper = await Paper.create({
    ...req.body,
    user: req.user?._id,
  });
  logger.info(`Paper added successfully: ${paper._id} by User: ${req.user?._id}`, { context: "PaperController" });
  res.status(201).json({ success: true, data: paper });
});

export const getPapers = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) throw new AppError("No user found", 401);

  const filters = {
    readingStage: req.query.readingStage ? (req.query.readingStage as string).split(",") : undefined,
    researchDomain: req.query.researchDomain ? (req.query.researchDomain as string).split(",") : undefined,
    impactScore: req.query.impactScore ? (req.query.impactScore as string).split(",") : undefined,
    dateRange: req.query.dateRange as string | undefined,
  };

  const papers = await findPapersByUser(req.user._id as any, filters);

  logger.info(`Fetched ${papers.length} papers for User: ${req.user._id}`, { context: "PaperController" });

  res.json({
    success: true,
    count: papers.length,
    papers,
  });
});

export const getPaperAnalytics = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) throw new AppError("No user found", 401);
  const analytics = await generateAnalytics(req.user._id as any);
  logger.info(`Generated analytics for User: ${req.user._id}`, { context: "PaperController" });
  res.json({
    success: true,
    data: analytics,
  });
});
