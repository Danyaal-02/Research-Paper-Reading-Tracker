import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios.js";

const useAnalyticsQuery = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data } = await api.get("/papers/analytics");
      return data.analytics;
    },
  });
};

export default useAnalyticsQuery;
