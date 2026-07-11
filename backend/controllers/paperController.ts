import { Response, NextFunction } from "express";
import { Types } from "mongoose";
import Paper from "../models/Paper.js";
import { generateAnalytics } from "../services/analyticsService.js";
import { AuthRequest } from "../types/index.js";
import { getPaginatedPapers } from "../services/paperService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

export const addPaper = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const paper = await Paper.create({
    ...req.body,
    user: req.user?._id,
  });
  res.status(201).json({ success: true, data: paper });
});

export const getPapers = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  if (!req.user) throw new AppError(AUTH_MESSAGES.NO_USER_FOUND, 401);

  const filters = {
    readingStage: req.query.readingStage ? (req.query.readingStage as string).split(",") : undefined,
    researchDomain: req.query.researchDomain ? (req.query.researchDomain as string).split(",") : undefined,
    impactScore: req.query.impactScore ? (req.query.impactScore as string).split(",") : undefined,
    dateRange: req.query.dateRange as string | undefined,
    search: req.query.search as string | undefined,
    sort: req.query.sort as string | undefined,
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
  };

  const { items, nextPage, totalCount } = await getPaginatedPapers(req.user.id, filters);

  res.json({
    success: true,
    count: items.length,
    total: totalCount,
    nextPage,
    hasMore: nextPage !== null,
    papers: items,
  });
});

export const getPaperAnalytics = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  if (!req.user) throw new AppError("No user found", 401);
  const analytics = await generateAnalytics(req.user._id as Types.ObjectId);
  res.json({
    success: true,
    data: analytics,
  });
});
