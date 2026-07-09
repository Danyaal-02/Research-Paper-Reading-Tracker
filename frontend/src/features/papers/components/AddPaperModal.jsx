import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paperSchema,
  RESEARCH_DOMAINS,
  READING_STAGES,
  IMPACT_SCORES,
} from "../schemas/paperValidation.js";
import useCreatePaperMutation from "../hooks/useCreatePaperMutation.js";
import Modal from "../../../components/ui/Modal.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Plus } from "lucide-react";

const AddPaperModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: "",
      firstAuthor: "",
      researchDomain: "",
      readingStage: "",
      citationCount: 0,
      impactScore: "",
      dateAdded: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useCreatePaperMutation();

  const onSubmit = (data) => {
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
            options={RESEARCH_DOMAINS}
            error={errors.researchDomain?.message}
            {...register("researchDomain")}
          />

          <Select
            id="paper-stage"
            label="Reading Stage"
            placeholder="Select stage"
            options={READING_STAGES}
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
            options={IMPACT_SCORES}
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
            className="flex-1"
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
