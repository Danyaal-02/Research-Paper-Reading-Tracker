import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios.js";
import toast from "react-hot-toast";

const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const { data: responseData } = await api.post("/auth/signup", {
        email: data.email,
        password: data.password,
      });
      return responseData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    },
  });
};

export default useSignupMutation;
