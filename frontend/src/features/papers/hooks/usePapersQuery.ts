import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import { DEFAULT_DATE_RANGE } from "../constants.ts";
import { API_ROUTES } from "../../../lib/apiRoutes.ts";

export interface PaperFilters {
  readingStage?: string[];
  researchDomain?: string[];
  impactScore?: string[];
  dateRange?: string;
}

export interface Paper {
  _id: string;
  title: string;
  firstAuthor: string;
  researchDomain: string;
  readingStage: string;
  citationCount: number;
  impactScore: string;
  dateAdded: string;
}

interface PapersResponse {
  success: boolean;
  count: number;
  papers: Paper[];
}

const usePapersQuery = (filters: PaperFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.readingStage?.length) {
    params.set("readingStage", filters.readingStage.join(","));
  }
  if (filters.researchDomain?.length) {
    params.set("researchDomain", filters.researchDomain.join(","));
  }
  if (filters.impactScore?.length) {
    params.set("impactScore", filters.impactScore.join(","));
  }
  if (filters.dateRange && filters.dateRange !== DEFAULT_DATE_RANGE) {
    params.set("dateRange", filters.dateRange);
  }

  const queryString = params.toString();

  return useQuery<PapersResponse>({
    queryKey: ["papers", filters],
    queryFn: async () => {
      const { data } = await api.get(`${API_ROUTES.PAPERS}${queryString ? `?${queryString}` : ""}`);
      return data;
    },
  });
};

export default usePapersQuery;
