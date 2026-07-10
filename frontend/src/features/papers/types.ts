export interface PaperFilters {
  readingStage?: string[];
  researchDomain?: string[];
  impactScore?: string[];
  dateRange?: string;
  search?: string;
  sorting?: { id: string; desc: boolean }[];
}

export interface Paper {
  _id: string;
  title: string;
  firstAuthor: string;
  researchDomain: string;
  readingStage: string;
  citationCount: number;
  impactScore: string;
  dateAdded: string;
}

export interface PapersResponse {
  success: boolean;
  count: number;
  total: number;
  hasMore: boolean;
  papers: Paper[];
}


