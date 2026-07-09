import asyncHandler from "express-async-handler";
import Paper from "../models/Paper.js";
import getAnalyticsData from "../services/analyticsService.js";

/**
 * @desc    Create a new paper
 * @route   POST /api/papers
 * @access  Private
 */
export const createPaper = asyncHandler(async (req, res) => {
  const {
    title,
    firstAuthor,
    researchDomain,
    readingStage,
    citationCount,
    impactScore,
    dateAdded,
  } = req.body;

  const paper = await Paper.create({
    user: req.user.id,
    title,
    firstAuthor,
    researchDomain,
    readingStage,
    citationCount,
    impactScore,
    dateAdded: dateAdded || Date.now(),
  });

  res.status(201).json({
    success: true,
    paper,
  });
});

/**
 * @desc    Get papers with dynamic filtering (scoped to current user)
 * @route   GET /api/papers
 * @access  Private
 *
 * Query params:
 *   readingStage  - comma-separated list (multi-select)
 *   researchDomain - comma-separated list (multi-select)
 *   impactScore   - comma-separated list (multi-select)
 *   dateRange     - one of: 'This Week', 'This Month', 'Last 3 Months', 'All time'
 */
export const getPapers = asyncHandler(async (req, res) => {
  const { readingStage, researchDomain, impactScore, dateRange } = req.query;

  // Base query: always scoped to the authenticated user
  const query = { user: req.user.id };

  // Multi-select filters: accept comma-separated strings
  if (readingStage) {
    const stages = readingStage.split(",").map((s) => s.trim());
    query.readingStage = { $in: stages };
  }

  if (researchDomain) {
    const domains = researchDomain.split(",").map((s) => s.trim());
    query.researchDomain = { $in: domains };
  }

  if (impactScore) {
    const scores = impactScore.split(",").map((s) => s.trim());
    query.impactScore = { $in: scores };
  }

  // Date range filter: calculate dynamic boundaries
  if (dateRange && dateRange !== "All time") {
    const now = new Date();
    let boundary;

    switch (dateRange) {
      case "This Week":
        boundary = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "This Month":
        boundary = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "Last 3 Months":
        boundary = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        break;
    }

    if (boundary) {
      query.dateAdded = { $gte: boundary };
    }
  }

  const papers = await Paper.find(query).sort({ dateAdded: -1 });

  res.json({
    success: true,
    count: papers.length,
    papers,
  });
});

/**
 * @desc    Get analytics data (scoped to current user)
 * @route   GET /api/papers/analytics
 * @access  Private
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getAnalyticsData(req.user.id);

  res.json({
    success: true,
    analytics,
  });
});
