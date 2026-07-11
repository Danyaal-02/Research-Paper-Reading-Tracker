import { useState, useEffect } from "react";
import { Plus, Filter, Search, RotateCcw } from "lucide-react";
import Button from "../../../components/ui/Button";
import FilterPanel from "./FilterPanel";
import PaperTable from "./PaperTable";
import AddPaperModal from "./AddPaperModal";
import useInfinitePapersQuery from "../hooks/usePapersQuery";
import { PaperFilters } from "../types";
import { useDebounce } from "../../../hooks/useDebounce";

const PaperLibraryScreen = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState<PaperFilters>({
    readingStage: [],
    researchDomain: [],
    impactScore: [],
    dateRange: "All time",
    sorting: [{ id: "dateAdded", desc: true }],
    search: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePapersQuery(filters);
  const papers = data?.pages.flatMap((page) => page.papers) || [];

  const activeFilterCount =
    (filters.readingStage?.length || 0) +
    (filters.researchDomain?.length || 0) +
    (filters.impactScore?.length || 0) +
    (filters.dateRange && filters.dateRange !== "All time" ? 1 : 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Sticky Action Bar & Filters Wrapper */}
      <div className="sticky top-0 z-30 bg-surface-900/95 backdrop-blur-sm border-b border-surface-800/40 sticky-undock">
        {/* Action Bar */}
        <div className="px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search"
                  className="input-base pl-9! w-full"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput("");
                  setFilters({
                    readingStage: [],
                    researchDomain: [],
                    impactScore: [],
                    dateRange: "All time",
                    sorting: [{ id: "dateAdded", desc: true }],
                    search: "",
                  });
                }}
              >
                <RotateCcw size={15} />
                Reset
              </Button>
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
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-surface-800/40">
            <FilterPanel filters={filters} onFilterChange={setFilters} onClose={() => setShowFilters(false)} />
          </div>
        )}
      </div>

      {/* Table */}
      <PaperTable 
        papers={papers} 
        sorting={filters.sorting!}
        onSortingChange={(updater) => {
          setFilters((prev) => {
            const nextSorting = typeof updater === 'function' ? updater(prev.sorting || []) : updater;
            return { ...prev, sorting: nextSorting };
          });
        }}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
      />

      {/* Add Paper Modal */}
      <AddPaperModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default PaperLibraryScreen;
