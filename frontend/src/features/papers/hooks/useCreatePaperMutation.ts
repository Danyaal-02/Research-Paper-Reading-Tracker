import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios.ts";
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
    onError: (error: any) => {
      const message =
        error.response?.data?.message || PAPER_STRINGS.ADD_ERROR;
      toast.error(message);
    },
  });
};

export default useCreatePaperMutation;
