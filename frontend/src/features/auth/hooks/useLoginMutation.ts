import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import toast from "react-hot-toast";
import { LoginFormData } from "../schemas/authValidation.ts";

const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      toast.success("Welcome back!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
};

export default useLoginMutation;
