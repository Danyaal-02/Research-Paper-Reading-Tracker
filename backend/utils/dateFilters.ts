export function getDateRangeStart(dateRange: string): Date | null {
  const now = new Date();
  switch (dateRange) {
    case 'This Week':      return new Date(now.setDate(now.getDate() - 7));
    case 'This Month':     return new Date(now.setMonth(now.getMonth() - 1));
    case 'Last 3 Months':  return new Date(now.setMonth(now.getMonth() - 3));
    default:               return null;
  }
}
