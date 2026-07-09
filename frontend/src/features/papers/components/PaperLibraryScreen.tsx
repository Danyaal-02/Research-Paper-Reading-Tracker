import { useState } from "react";
import { Plus, Filter, Loader2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import FilterPanel from "./FilterPanel";
import PaperTable from "./PaperTable";
import AddPaperModal from "./AddPaperModal";
import usePapersQuery, { PaperFilters } from "../hooks/usePapersQuery";

const PaperLibraryScreen = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState<PaperFilters>({
    readingStage: [],
    researchDomain: [],
    impactScore: [],
    dateRange: "All time",
  });

  const { data, isLoading } = usePapersQuery(filters);
  const papers = data?.papers || [];

  const activeFilterCount =
    (filters.readingStage?.length || 0) +
    (filters.researchDomain?.length || 0) +
    (filters.impactScore?.length || 0) +
    (filters.dateRange && filters.dateRange !== "All time" ? 1 : 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={15} />
          Add Paper
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel filters={filters} onFilterChange={setFilters} />
      )}

      {/* Table */}
      {isLoading ? (
        <div className="glass-card p-12 text-center">
          <Loader2 size={32} className="animate-spin text-primary-400 mx-auto mb-3" />
          <p className="text-surface-400 text-sm">Loading your papers…</p>
        </div>
      ) : (
        <PaperTable papers={papers} />
      )}

      {/* Add Paper Modal */}
      <AddPaperModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default PaperLibraryScreen;
