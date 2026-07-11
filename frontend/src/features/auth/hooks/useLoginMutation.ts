import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import axios from "axios";
import toast from "react-hot-toast";
import { LoginFormData } from "../schemas/authValidation.ts";
import { AUTH_MESSAGES } from "../../../constants/messages.ts";
import { API_ROUTES } from "../../../lib/apiRoutes.ts";
import { AuthResponse } from "../types.ts";

const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const { data } = await api.post<AuthResponse>(API_ROUTES.AUTH_LOGIN, credentials);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
    },
    onError: (error: unknown) => {
      let message: string = AUTH_MESSAGES.LOGIN_ERROR;
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    },
  });
};

export default useLoginMutation;
