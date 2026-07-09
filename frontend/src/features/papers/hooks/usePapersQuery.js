import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios.js";

const usePapersQuery = (filters = {}) => {
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
  if (filters.dateRange && filters.dateRange !== "All time") {
    params.set("dateRange", filters.dateRange);
  }

  const queryString = params.toString();

  return useQuery({
    queryKey: ["papers", filters],
    queryFn: async () => {
      const { data } = await api.get(`/papers${queryString ? `?${queryString}` : ""}`);
      return data;
    },
  });
};

export default usePapersQuery;
