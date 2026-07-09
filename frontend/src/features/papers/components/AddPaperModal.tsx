import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paperSchema,
  PaperFormData,
  RESEARCH_DOMAINS,
  READING_STAGES,
  IMPACT_SCORES,
} from "../schemas/paperValidation.ts";
import useCreatePaperMutation from "../hooks/useCreatePaperMutation.ts";
import Modal from "../../../components/ui/Modal.tsx";
import Input from "../../../components/ui/Input.tsx";
import Select from "../../../components/ui/Select.tsx";
import Button from "../../../components/ui/Button.tsx";
import { Plus } from "lucide-react";

interface AddPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPaperModal: React.FC<AddPaperModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaperFormData>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: "",
      firstAuthor: "",
      researchDomain: RESEARCH_DOMAINS[0],
      readingStage: READING_STAGES[0],
      citationCount: 0,
      impactScore: IMPACT_SCORES[0],
      dateAdded: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useCreatePaperMutation();

  const onSubmit = (data: PaperFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Research Paper">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="paper-title"
          label="Paper Title"
          placeholder="e.g. Attention Is All You Need"
          error={errors.title?.message}
          {...register("title")}
        />

        <Input
          id="paper-author"
          label="First Author Name"
          placeholder="e.g. Ashish Vaswani"
          error={errors.firstAuthor?.message}
          {...register("firstAuthor")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="paper-domain"
            label="Research Domain"
            placeholder="Select domain"
            options={[...RESEARCH_DOMAINS]}
            error={errors.researchDomain?.message}
            {...register("researchDomain")}
          />

          <Select
            id="paper-stage"
            label="Reading Stage"
            placeholder="Select stage"
            options={[...READING_STAGES]}
            error={errors.readingStage?.message}
            {...register("readingStage")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="paper-citations"
            label="Citation Count"
            type="number"
            min="0"
            placeholder="0"
            error={errors.citationCount?.message}
            {...register("citationCount")}
          />

          <Select
            id="paper-impact"
            label="Impact Score"
            placeholder="Select impact"
            options={[...IMPACT_SCORES]}
            error={errors.impactScore?.message}
            {...register("impactScore")}
          />
        </div>

        <Input
          id="paper-date"
          label="Date Added"
          type="date"
          error={errors.dateAdded?.message}
          {...register("dateAdded")}
        />

        <div className="flex gap-3 mt-2 pt-4 border-t border-surface-700/50">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createMutation.isPending}
            className="flex-1 cursor-pointer"
          >
            <Plus size={16} />
            Add Paper
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPaperModal;
