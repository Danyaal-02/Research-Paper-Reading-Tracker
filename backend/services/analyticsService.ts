import { Types } from "mongoose";
import Paper from "../models/Paper.js";
import { READING_STAGES } from "../constants/paperEnums.js";

export const generateAnalytics = async (userId: Types.ObjectId) => {
  // 1. Funnel Chart Data: Count by Reading Stage
  const funnelPipeline = [
    { $match: { user: userId } },
    {
      $group: {
        _id: "$readingStage",
        count: { $sum: 1 },
      },
    },
  ];

  // 2. Scatter Plot Data: Papers with Citations and Impact
  const scatterPipeline = [
    { $match: { user: userId } },
    {
      $project: {
        _id: "$title",
        impactScore: 1,
        citationCount: 1,
      },
    },
  ];

  // 3. Stacked Bar Data: Domain grouped by Stage
  const stackedBarPipeline = [
    { $match: { user: userId } },
    {
      $group: {
        _id: { domain: "$researchDomain", stage: "$readingStage" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.domain",
        stages: {
          $push: {
            stage: "$_id.stage",
            count: "$count",
          },
        },
      },
    },
  ];

  // 4. Summary Metrics
  const summaryPipeline = [
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalPapers: { $sum: 1 },
        totalCitations: { $sum: "$citationCount" },
        stagesUsed: { $addToSet: "$readingStage" },
        fullyReadCount: {
          $sum: { $cond: [{ $eq: ["$readingStage", "Fully Read"] }, 1, 0] },
        },
      },
    },
  ];

  // Execute all pipelines in parallel
  const [funnel, scatter, stackedBar, summaryResult] = await Promise.all([
    Paper.aggregate(funnelPipeline),
    Paper.aggregate(scatterPipeline),
    Paper.aggregate(stackedBarPipeline),
    Paper.aggregate(summaryPipeline),
  ]);

  const summaryData = summaryResult[0] || {
    totalPapers: 0,
    totalCitations: 0,
    stagesUsed: [],
    fullyReadCount: 0,
  };

  const summary = {
    totalPapers: summaryData.totalPapers,
    fullyRead: summaryData.fullyReadCount,
    avgCitations:
      summaryData.totalPapers > 0
        ? summaryData.totalCitations / summaryData.totalPapers
        : 0,
    activeStages: summaryData.stagesUsed.length,
    completionRate:
      summaryData.totalPapers > 0
        ? ((summaryData.fullyReadCount / summaryData.totalPapers) * 100).toFixed(1)
        : 0,
  };

  return {
    summary,
    funnel,
    scatter,
    stackedBar,
  };
};
