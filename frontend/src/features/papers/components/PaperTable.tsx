import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { Paper } from "../hooks/usePapersQuery.ts";
import { paperColumns } from "./PaperTable.columns.tsx";
import { PAPER_STRINGS } from "../constants.ts";

interface PaperTableProps {
  papers: Paper[];
}

const PaperTable: React.FC<PaperTableProps> = ({ papers = [] }) => {
  const columns = useMemo(() => paperColumns, []);

  const table = useReactTable({
    data: papers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (papers.length === 0) {
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
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" ? (
                        <ArrowUp size={13} className="text-primary-400" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ArrowDown size={13} className="text-primary-400" />
                      ) : (
                        <ArrowUpDown size={13} className="opacity-30" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-surface-700/30 text-xs text-surface-500">
        {papers.length} paper{papers.length !== 1 ? "s" : ""} in library
      </div>
    </div>
  );
};

export default PaperTable;
