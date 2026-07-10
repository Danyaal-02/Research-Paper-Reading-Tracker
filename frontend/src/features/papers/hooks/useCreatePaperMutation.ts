import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
import axios from "axios";
import toast from "react-hot-toast";
import { PaperFormData } from "../schemas/paperValidation.ts";
import { PAPER_STRINGS } from "../constants.ts";
import { API_ROUTES } from "../../../lib/apiRoutes.ts";

const useCreatePaperMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paperData: PaperFormData) => {
      const { data } = await api.post(API_ROUTES.PAPERS, paperData);
      return data;
    },
    onSuccess: () => {
      // Invalidate both papers and analytics queries
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success(PAPER_STRINGS.ADD_SUCCESS);
    },
    onError: (error: unknown) => {
      let message: string = PAPER_STRINGS.ADD_ERROR;
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    },
  });
};

export default useCreatePaperMutation;
