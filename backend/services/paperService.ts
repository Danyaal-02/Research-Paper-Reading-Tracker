import { Types } from 'mongoose';
import Paper, { IPaper } from '../models/Paper.js';
import { getDateRangeStart } from '../utils/dateFilters.js';
import { FilterQuery } from 'mongoose';
import { PaperFilters } from '../types/index.js';
import { parseSortString, getPaginationData } from '../utils/queryUtils.js';

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
  const sortObj = parseSortString(filters.sort);
  const { skip, limit } = getPaginationData(filters.page, filters.limit);

  const total = await Paper.countDocuments(query);
  const papers = await Paper.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  return { papers, total };
};
