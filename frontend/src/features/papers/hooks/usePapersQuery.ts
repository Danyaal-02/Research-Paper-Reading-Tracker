import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import { DEFAULT_DATE_RANGE } from "../constants.ts";
import { API_ROUTES } from "../../../lib/apiRoutes.ts";

import { PaperFilters, PapersResponse } from "../types.ts";

const useInfinitePapersQuery = (filters: PaperFilters = {}) => {
  return useInfiniteQuery<PapersResponse>({
    queryKey: ["papers", filters],
    queryFn: async ({ pageParam = 1 }) => {
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
      if (filters.search) {
        params.set("search", filters.search);
      }
      if (filters.sorting && filters.sorting.length > 0) {
        const sortStr = filters.sorting
          .map((s) => (s.desc ? `-${s.id}` : s.id))
          .join(",");
        params.set("sort", sortStr);
      }
      
      params.set("page", String(pageParam));
      params.set("limit", "10");

      const queryString = params.toString();
      const { data } = await api.get(`${API_ROUTES.PAPERS}?${queryString}`);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export default useInfinitePapersQuery;
