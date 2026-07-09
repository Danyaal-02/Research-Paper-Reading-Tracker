import { z } from "zod";

const RESEARCH_DOMAINS = [
  "Computer Science",
  "Biology",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Social Sciences",
];

const READING_STAGES = [
  "Abstract Read",
  "Introduction Done",
  "Methodology Done",
  "Results Analyzed",
  "Fully Read",
  "Notes Completed",
];

const IMPACT_SCORES = ["High Impact", "Medium Impact", "Low Impact", "Unknown"];

export const paperSchema = z.object({
  title: z
    .string()
    .min(1, "Paper title is required")
    .max(300, "Title must be under 300 characters"),
  firstAuthor: z
    .string()
    .min(1, "First author name is required")
    .max(100, "Author name must be under 100 characters"),
  researchDomain: z.enum(RESEARCH_DOMAINS, {
    errorMap: () => ({ message: "Please select a research domain" }),
  }),
  readingStage: z.enum(READING_STAGES, {
    errorMap: () => ({ message: "Please select a reading stage" }),
  }),
  citationCount: z.coerce
    .number({ invalid_type_error: "Citation count must be a number" })
    .int("Citation count must be a whole number")
    .min(0, "Citation count cannot be negative"),
  impactScore: z.enum(IMPACT_SCORES, {
    errorMap: () => ({ message: "Please select an impact score" }),
  }),
  dateAdded: z.string().optional(),
});

export { RESEARCH_DOMAINS, READING_STAGES, IMPACT_SCORES };
