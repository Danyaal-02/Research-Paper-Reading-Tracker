import { Response, NextFunction } from "express";
import Paper from "../models/Paper.js";
import { generateAnalytics } from "../services/analyticsService.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const addPaper = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paper = await Paper.create({
      ...req.body,
      user: req.user?._id,
    });
    res.status(201).json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
};

export const getPapers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query: any = { user: req.user?._id };

    // Filters
    if (req.query.readingStage) {
      query.readingStage = { $in: (req.query.readingStage as string).split(",") };
    }
    if (req.query.researchDomain) {
      query.researchDomain = {
        $in: (req.query.researchDomain as string).split(","),
      };
    }
    if (req.query.impactScore) {
      query.impactScore = { $in: (req.query.impactScore as string).split(",") };
    }

    // Date Range Filter
    if (req.query.dateRange) {
      const dateRange = req.query.dateRange as string;
      const now = new Date();
      let startDate;

      if (dateRange === "This Week") {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (dateRange === "This Month") {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      } else if (dateRange === "Last 3 Months") {
        startDate = new Date(now.setMonth(now.getMonth() - 3));
      }

      if (startDate) {
        query.dateAdded = { $gte: startDate };
      }
    }

    const papers = await Paper.find(query).sort({ dateAdded: -1 });

    res.json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaperAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new Error("No user found");
    const analytics = await generateAnalytics(req.user._id as any);
    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};
