import { ColumnDef } from "@tanstack/react-table";
import Badge from "../../../components/ui/Badge.tsx";
import { Paper } from "../hooks/usePapersQuery.ts";

export const paperColumns: ColumnDef<Paper, any>[] = [
  {
    accessorKey: "title",
    header: "Paper Title",
    size: 280,
    cell: ({ getValue }) => {
      const title = getValue<string>();
      return (
        <div
          className="max-w-70 truncate font-medium text-surface-100"
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
      <span className="text-surface-300">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "researchDomain",
    header: "Domain",
    size: 140,
    cell: ({ getValue }) => <Badge type="domain">{getValue<string>()}</Badge>,
  },
  {
    accessorKey: "readingStage",
    header: "Reading Stage",
    size: 155,
    cell: ({ getValue }) => <Badge type="stage">{getValue<string>()}</Badge>,
  },
  {
    accessorKey: "citationCount",
    header: "Citations",
    size: 100,
    cell: ({ getValue }) => (
      <span className="text-surface-200 font-mono text-sm">
        {getValue<number>().toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "impactScore",
    header: "Impact",
    size: 130,
    cell: ({ getValue }) => <Badge type="impact">{getValue<string>()}</Badge>,
  },
  {
    accessorKey: "dateAdded",
    header: "Date Added",
    size: 110,
    cell: ({ getValue }) => (
      <span className="text-surface-400 text-sm">
        {new Date(getValue<string>()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
];
