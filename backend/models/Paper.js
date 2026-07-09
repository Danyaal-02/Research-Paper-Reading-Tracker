import mongoose from "mongoose";
import {
  RESEARCH_DOMAINS,
  READING_STAGES,
  IMPACT_SCORES,
} from "../constants/paperEnums.js";

const paperSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Paper title is required"],
      trim: true,
    },
    firstAuthor: {
      type: String,
      required: [true, "First author name is required"],
      trim: true,
    },
    researchDomain: {
      type: String,
      required: [true, "Research domain is required"],
      enum: {
        values: RESEARCH_DOMAINS,
        message: "{VALUE} is not a valid research domain",
      },
    },
    readingStage: {
      type: String,
      required: [true, "Reading stage is required"],
      enum: {
        values: READING_STAGES,
        message: "{VALUE} is not a valid reading stage",
      },
    },
    citationCount: {
      type: Number,
      required: [true, "Citation count is required"],
      min: [0, "Citation count cannot be negative"],
    },
    impactScore: {
      type: String,
      required: [true, "Impact score is required"],
      enum: {
        values: IMPACT_SCORES,
        message: "{VALUE} is not a valid impact score",
      },
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for efficient user-scoped date queries
paperSchema.index({ user: 1, dateAdded: -1 });

const Paper = mongoose.model("Paper", paperSchema);

export default Paper;
