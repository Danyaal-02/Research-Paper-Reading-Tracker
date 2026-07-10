import { Types } from 'mongoose';
import Paper, { IPaper } from '../models/Paper.js';
import { getDateRangeStart } from '../utils/dateFilters.js';
import { PaperFilters } from '../types/index.js';
import { FilterQuery } from 'mongoose';

export const findPapersByUser = async (userId: string, filters: PaperFilters) => {
  const query: FilterQuery<IPaper> = { user: userId };

  if (filters.readingStage?.length)   query.readingStage   = { $in: filters.readingStage };
  if (filters.researchDomain?.length) query.researchDomain = { $in: filters.researchDomain };
  if (filters.impactScore?.length)    query.impactScore    = { $in: filters.impactScore };

  const startDate = filters.dateRange ? getDateRangeStart(filters.dateRange) : null;
  if (startDate) query.dateAdded = { $gte: startDate };

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { firstAuthor: { $regex: filters.search, $options: 'i' } }
    ];
  }

  // Parse multi-column sort: "citationCount,-dateAdded" -> { citationCount: 1, dateAdded: -1 }
  const sortObj: Record<string, 1 | -1> = {};
  if (filters.sort) {
    const sortKeys = filters.sort.split(',');
    sortKeys.forEach((key) => {
      const isDesc = key.startsWith('-');
      const field = isDesc ? key.substring(1) : key;
      sortObj[field] = isDesc ? -1 : 1;
    });
  } else {
    // Default fallback
    sortObj['dateAdded'] = -1;
  }

  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const skip = (page - 1) * limit;

  const total = await Paper.countDocuments(query);
  const papers = await Paper.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  return { papers, total };
};
