import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Badge from "../../../components/ui/Badge.jsx";
import { ArrowUpDown, ArrowUp, ArrowDown, FileText } from "lucide-react";

const PaperTable = ({ papers = [] }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Paper Title",
        size: 280,
        cell: ({ getValue }) => {
          const title = getValue();
          return (
            <div
              className="max-w-[280px] truncate font-medium text-surface-100"
              title={title}
            >
              {title}
            </div>
          );
        },
      },
      {
        accessorKey: "firstAuthor",
        header: "First Author",
        size: 150,
        cell: ({ getValue }) => (
          <span className="text-surface-300">{getValue()}</span>
        ),
      },
      {
        accessorKey: "researchDomain",
        header: "Domain",
        size: 140,
        cell: ({ getValue }) => <Badge type="domain">{getValue()}</Badge>,
      },
      {
        accessorKey: "readingStage",
        header: "Reading Stage",
        size: 155,
        cell: ({ getValue }) => <Badge type="stage">{getValue()}</Badge>,
      },
      {
        accessorKey: "citationCount",
        header: "Citations",
        size: 100,
        cell: ({ getValue }) => (
          <span className="text-surface-200 font-mono text-sm">
            {getValue().toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "impactScore",
        header: "Impact",
        size: 130,
        cell: ({ getValue }) => <Badge type="impact">{getValue()}</Badge>,
      },
      {
        accessorKey: "dateAdded",
        header: "Date Added",
        size: 110,
        cell: ({ getValue }) => (
          <span className="text-surface-400 text-sm">
            {new Date(getValue()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
    ],
    []
  );

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
          No papers found
        </h3>
        <p className="text-sm text-surface-500 max-w-sm mx-auto">
          Add your first research paper to start tracking your reading progress, or adjust your filters.
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
