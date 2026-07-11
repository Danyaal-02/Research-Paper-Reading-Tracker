import React from "react";
import Checkbox from "../../../components/ui/Checkbox.tsx";
import { Filter, X } from "lucide-react";
import {
  RESEARCH_DOMAINS,
  READING_STAGES,
  IMPACT_SCORES,
} from "../schemas/paperValidation.ts";
import { PaperFilters } from "../types.ts";
import PAPER_CONFIGS from "../constants.ts";

interface FilterPanelProps {
  filters: PaperFilters;
  onFilterChange: (filters: PaperFilters) => void;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onClose }) => {
  const toggleArrayFilter = (key: keyof PaperFilters, value: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const setDateRange = (value: string) => {
    onFilterChange({ ...filters, dateRange: value });
  };

  return (
    <div className="glass-card-sm p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-surface-200">
          <Filter size={16} />
          <h3 className="text-sm font-semibold">Filters</h3>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-primary-400 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Reading Stage */}
        <div>
          <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2.5">
            Reading Stage
          </h4>
          <div className="flex flex-col gap-1.5">
            {READING_STAGES.map((stage) => (
              <Checkbox
                key={stage}
                id={`filter-stage-${stage}`}
                label={stage}
                checked={filters.readingStage?.includes(stage) || false}
                onChange={() => toggleArrayFilter("readingStage", stage)}
              />
            ))}
          </div>
        </div>

        {/* Research Domain */}
        <div>
          <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2.5">
            Research Domain
          </h4>
          <div className="flex flex-col gap-1.5">
            {RESEARCH_DOMAINS.map((domain) => (
              <Checkbox
                key={domain}
                id={`filter-domain-${domain}`}
                label={domain}
                checked={filters.researchDomain?.includes(domain) || false}
                onChange={() => toggleArrayFilter("researchDomain", domain)}
              />
            ))}
          </div>
        </div>

        {/* Impact Score */}
        <div>
          <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2.5">
            Impact Score
          </h4>
          <div className="flex flex-col gap-1.5">
            {IMPACT_SCORES.map((score) => (
              <Checkbox
                key={score}
                id={`filter-impact-${score}`}
                label={score}
                checked={filters.impactScore?.includes(score) || false}
                onChange={() => toggleArrayFilter("impactScore", score)}
              />
            ))}
          </div>
        </div>

        {/* Date Added */}
        <div>
          <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2.5">
            Date Added
          </h4>
          <div className="flex flex-col gap-1.5">
            {PAPER_CONFIGS.DATE_OPTIONS.map((option) => (
              <label
                key={option}
                htmlFor={`filter-date-${option}`}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-surface-300 hover:text-surface-100 transition-colors py-0.5"
              >
                <input
                  type="radio"
                  id={`filter-date-${option}`}
                  name="dateRange"
                  checked={
                    filters.dateRange === option ||
                    (!filters.dateRange && option === PAPER_CONFIGS.DEFAULT_DATE_RANGE)
                  }
                  onChange={() => setDateRange(option)}
                  className="radio-custom"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
