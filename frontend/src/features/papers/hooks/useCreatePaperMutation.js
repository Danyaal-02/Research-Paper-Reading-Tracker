import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios.js";
import toast from "react-hot-toast";

const useCreatePaperMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paperData) => {
      const { data } = await api.post("/papers", paperData);
      return data;
    },
    onSuccess: () => {
      // Invalidate both papers and analytics queries
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Paper added successfully!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to add paper. Please try again.";
      toast.error(message);
    },
  });
};

export default useCreatePaperMutation;
