import mongoose from "mongoose";
import Paper from "../models/Paper.js";

/**
 * Run optimized MongoDB aggregation pipelines for analytics.
 * All pipelines start with $match: { user: currentUserId } for data isolation.
 *
 * @param {string} userId - The authenticated user's ID
 * @returns {Object} Analytics data: funnel, scatter, stackedBar, summary
 */
const getAnalyticsData = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Pipeline 1: Funnel — paper count per reading stage
  const funnelData = await Paper.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: "$readingStage",
        count: { $sum: 1 },
      },
    },
    { $project: { stage: "$_id", count: 1, _id: 0 } },
  ]);

  // Pipeline 2: Scatter — citation count + impact score per paper
  const scatterData = await Paper.aggregate([
    { $match: { user: userObjectId } },
    {
      $project: {
        _id: 0,
        title: 1,
        citationCount: 1,
        impactScore: 1,
      },
    },
  ]);

  // Pipeline 3: Stacked Bar — papers by domain and reading stage
  const stackedBarData = await Paper.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: {
          domain: "$researchDomain",
          stage: "$readingStage",
        },
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
    { $project: { domain: "$_id", stages: 1, _id: 0 } },
  ]);

  // Pipeline 4: Summary metrics
  const summaryData = await Paper.aggregate([
    { $match: { user: userObjectId } },
    {
      $facet: {
        // Papers by reading stage
        byStage: [
          {
            $group: {
              _id: "$readingStage",
              count: { $sum: 1 },
            },
          },
          { $project: { stage: "$_id", count: 1, _id: 0 } },
        ],
        // Average citations per domain
        avgCitationsByDomain: [
          {
            $group: {
              _id: "$researchDomain",
              avgCitations: { $avg: "$citationCount" },
            },
          },
          {
            $project: {
              domain: "$_id",
              avgCitations: { $round: ["$avgCitations", 1] },
              _id: 0,
            },
          },
        ],
        // Completion rate: Fully Read / Total
        completionRate: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              fullyRead: {
                $sum: {
                  $cond: [{ $eq: ["$readingStage", "Fully Read"] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              total: 1,
              fullyRead: 1,
              rate: {
                $cond: [
                  { $eq: ["$total", 0] },
                  0,
                  {
                    $round: [
                      { $multiply: [{ $divide: ["$fullyRead", "$total"] }, 100] },
                      1,
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ]);

  const summary = summaryData[0] || {};

  return {
    funnel: funnelData,
    scatter: scatterData,
    stackedBar: stackedBarData,
    summary: {
      byStage: summary.byStage || [],
      avgCitationsByDomain: summary.avgCitationsByDomain || [],
      completionRate: summary.completionRate?.[0] || {
        total: 0,
        fullyRead: 0,
        rate: 0,
      },
    },
  };
};

export default getAnalyticsData;
