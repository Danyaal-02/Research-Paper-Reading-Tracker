import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import { API_ROUTES } from "../../../lib/apiRoutes.ts";
import { AuthResponse } from "../types.ts";
import axios from "axios";
import toast from "react-hot-toast";
import { SignupFormData } from "../schemas/authValidation.ts";
import { AUTH_MESSAGES } from "../../../constants/messages.ts";

const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: SignupFormData) => {
      const { data } = await api.post<AuthResponse>(API_ROUTES.AUTH_SIGNUP, credentials);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      toast.success(AUTH_MESSAGES.SIGNUP_SUCCESS);
    },
    onError: (error: unknown) => {
      let message: string = AUTH_MESSAGES.SIGNUP_ERROR;
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    },
  });
};

export default useSignupMutation;
