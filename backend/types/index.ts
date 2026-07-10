import { Request } from "express";
import { IUser } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface PaperFilters {
  readingStage?: string[];
  researchDomain?: string[];
  impactScore?: string[];
  dateRange?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
