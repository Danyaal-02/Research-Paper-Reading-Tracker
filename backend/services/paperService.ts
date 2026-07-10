import { Types } from 'mongoose';
import Paper from '../models/Paper.js';
import { getDateRangeStart } from '../utils/dateFilters.js';

interface PaperQueryFilters {
  readingStage?: string[];
  researchDomain?: string[];
  impactScore?: string[];
  dateRange?: string;
}

export const findPapersByUser = async (userId: Types.ObjectId, filters: PaperQueryFilters) => {
  const query: Record<string, any> = { user: userId };

  if (filters.readingStage?.length)   query.readingStage   = { $in: filters.readingStage };
  if (filters.researchDomain?.length) query.researchDomain = { $in: filters.researchDomain };
  if (filters.impactScore?.length)    query.impactScore    = { $in: filters.impactScore };

  const startDate = filters.dateRange ? getDateRangeStart(filters.dateRange) : null;
  if (startDate) query.dateAdded = { $gte: startDate };

  return Paper.find(query).sort({ dateAdded: -1 });
};
