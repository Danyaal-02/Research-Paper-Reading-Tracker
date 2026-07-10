import { READING_STAGES } from '../papers/schemas/paperValidation.ts';

export const CHART_HEIGHT_PX = 350;
export const CHART_HEIGHT_REM = '21.875rem';

export const FUNNEL_STAGES = READING_STAGES;
export const FUNNEL_STAGE_COLORS = ["#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef"];
export const STAGE_COLORS_MAP: Record<string, string> = {
  "Abstract Read": "#0ea5e9", // sky-500
  "Introduction Done": "#8b5cf6", // violet-500
  "Methodology Done": "#f59e0b", // amber-500
  "Results Analyzed": "#f97316", // orange-500
  "Fully Read": "#10b981", // emerald-500
  "Notes Completed": "#6366f1", // indigo-500
};

export const ANALYTICS_STRINGS = {
  FUNNEL_TITLE: "Reading Funnel",
  FUNNEL_SUBTITLE: "Cumulative pipeline progression",
  SCATTER_TITLE: "Citation vs Impact Score",
  SCATTER_SUBTITLE: "Papers grouped by impact score with citation counts",
  STACKED_TITLE: "Papers by Domain & Stage",
  STACKED_SUBTITLE: "Stacked view of reading progress across research domains",
  SUMMARY_LIBRARY_TITLE: "Library Overview",
  SUMMARY_STAGE_TITLE: "Papers By Stage",
  SUMMARY_CITATIONS_TITLE: "Avg Citations / Domain",
} as const;
