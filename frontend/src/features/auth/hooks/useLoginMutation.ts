import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import toast from "react-hot-toast";
import { LoginFormData } from "../schemas/authValidation.ts";
import { AUTH_STRINGS } from "../constants.ts";
import { API_ROUTES } from "../../../lib/apiRoutes.ts";

const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const { data } = await api.post(API_ROUTES.AUTH_LOGIN, credentials);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      toast.success(AUTH_STRINGS.LOGIN_SUCCESS);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || AUTH_STRINGS.LOGIN_ERROR;
      toast.error(message);
    },
  });
};

export default useLoginMutation;
