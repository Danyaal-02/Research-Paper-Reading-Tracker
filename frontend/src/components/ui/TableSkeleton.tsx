import { Skeleton } from "./Skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton = ({ rows = 5, columns = 8 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={`skeleton-row-${i}`}>
          <td colSpan={columns} className="py-2 px-4">
            <Skeleton className="h-12 w-full" />
          </td>
        </tr>
      ))}
    </>
  );
};
