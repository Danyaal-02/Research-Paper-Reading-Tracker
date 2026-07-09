import mongoose, { Document, Schema } from "mongoose";
import {
  RESEARCH_DOMAINS,
  READING_STAGES,
  IMPACT_SCORES,
} from "../constants/paperEnums.js";

export interface IPaper extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  firstAuthor: string;
  researchDomain: string;
  readingStage: string;
  citationCount: number;
  impactScore: string;
  dateAdded: Date;
}

const paperSchema = new Schema<IPaper>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    firstAuthor: {
      type: String,
      required: true,
      trim: true,
    },
    researchDomain: {
      type: String,
      required: true,
      enum: RESEARCH_DOMAINS,
    },
    readingStage: {
      type: String,
      required: true,
      enum: READING_STAGES,
    },
    citationCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    impactScore: {
      type: String,
      required: true,
      enum: IMPACT_SCORES,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound indexes for efficient filtering by user + fields
paperSchema.index({ user: 1, researchDomain: 1 });
paperSchema.index({ user: 1, readingStage: 1 });
paperSchema.index({ user: 1, impactScore: 1 });
paperSchema.index({ user: 1, dateAdded: -1 });

const Paper = mongoose.model<IPaper>("Paper", paperSchema);

export default Paper;
