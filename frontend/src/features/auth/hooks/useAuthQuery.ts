import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import { API_ROUTES } from "../../../lib/apiRoutes.ts";

export const useAuthQuery = () => useQuery({
  queryKey: ["auth", "me"],
  queryFn: async () => {
    const { data } = await api.get(API_ROUTES.AUTH_ME);
    return data.user;
  },
  retry: false,
  staleTime: Infinity,
});
