import React, { useMemo, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { Paper } from "../types.ts";
import { paperColumns } from "./PaperTable.columns.tsx";
import { PAPER_STRINGS } from "../constants.ts";

interface PaperTableProps {
  papers: Paper[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading?: boolean;
}

const PaperTable: React.FC<PaperTableProps> = ({ 
  papers = [],
  sorting,
  onSortingChange,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading
}) => {
  const columns = useMemo(() => paperColumns, []);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const table = useReactTable({
    data: papers,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  if (!isLoading && papers.length === 0) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-800/80 flex items-center justify-center">
          <FileText size={28} className="text-surface-500" />
        </div>
        <h3 className="text-lg font-semibold text-surface-300 mb-2">
          {PAPER_STRINGS.EMPTY_TITLE}
        </h3>
        <p className="text-sm text-surface-500 max-w-sm mx-auto">
          {PAPER_STRINGS.EMPTY_SUBTITLE}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize(), cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        header.column.getIsSorted() === "asc" ? (
                          <ArrowUp size={13} className="text-primary-400" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown size={13} className="text-primary-400" />
                        ) : (
                          <ArrowUpDown size={13} className="opacity-30" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  <td colSpan={table.getAllColumns().length} className="py-2 px-4">
                    <div className="animate-pulse bg-slate-800/50 h-12 w-full rounded-md" />
                  </td>
                </tr>
              ))
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Infinite Scroll Loader & Target */}
      <div 
        ref={observerTarget}
        className="px-4 py-4 border-t border-surface-700/30 flex justify-between items-center text-xs text-surface-500"
      >
        <span>
          {papers.length} paper{papers.length !== 1 ? "s" : ""} in library
        </span>
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-primary-400 animate-pulse">
            <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperTable;
