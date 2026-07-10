export const parseSortString = (sortStr?: string, defaultSort: Record<string, 1 | -1> = { dateAdded: -1 }): Record<string, 1 | -1> => {
  if (!sortStr) return defaultSort;

  const sortObj: Record<string, 1 | -1> = {};
  const sortKeys = sortStr.split(',');
  sortKeys.forEach((key) => {
    const isDesc = key.startsWith('-');
    const field = isDesc ? key.substring(1) : key;
    sortObj[field] = isDesc ? -1 : 1;
  });
  return sortObj;
};

export const getPaginationData = (page?: number, limit?: number) => {
  const p = Math.max(1, page || 1);
  const l = Math.max(1, limit || 10);
  const skip = (p - 1) * l;
  return { page: p, limit: l, skip };
};
