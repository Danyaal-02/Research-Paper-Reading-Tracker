import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";

export interface AnalyticsSummary {
  totalPapers: number;
  fullyRead: number;
  completionRate: number;
  avgCitationsPerDomain: { domain: string; avg: number }[];
  papersByStage: { stage: string; count: number }[];
}

export interface FunnelData {
  _id: string;
  count: number;
}

export interface ScatterData {
  _id: string; // Paper title
  impactScore: string;
  citationCount: number;
}

export interface StackedBarData {
  _id: string; // Domain
  stages: {
    stage: string;
    count: number;
  }[];
  [key: string]: string | number | { stage: string; count: number }[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    summary: AnalyticsSummary;
    funnel: FunnelData[];
    scatter: ScatterData[];
    stackedBar: StackedBarData[];
  };
}

const useAnalyticsQuery = () => {
  return useQuery<AnalyticsResponse["data"]>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data } = await api.get<AnalyticsResponse>("/papers/analytics");
      return data.data;
    },
  });
};

export default useAnalyticsQuery;
