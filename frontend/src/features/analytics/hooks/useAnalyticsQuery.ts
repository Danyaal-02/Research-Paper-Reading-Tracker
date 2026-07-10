import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import { API_ROUTES } from "../../../lib/apiRoutes.ts";

import { AnalyticsResponse } from "../types.ts";

const useAnalyticsQuery = () => {
  return useQuery<AnalyticsResponse["data"]>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data } = await api.get<AnalyticsResponse>(API_ROUTES.ANALYTICS);
      return data.data;
    },
  });
};

export default useAnalyticsQuery;
