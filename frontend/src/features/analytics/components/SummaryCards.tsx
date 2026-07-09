import React from "react";
import { BookOpen, CheckCircle2, TrendingUp, BarChart } from "lucide-react";
import { AnalyticsSummary } from "../hooks/useAnalyticsQuery.ts";

interface SummaryCardsProps {
  summary: AnalyticsSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Papers */}
      <div className="glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "0ms" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <BookOpen size={16} />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-3xl font-bold text-surface-100">{summary.totalPapers}</h4>
          <p className="text-sm text-surface-400 mt-1">Total Papers</p>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={16} />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-3xl font-bold text-surface-100">{summary.completionRate}%</h4>
          <p className="text-sm text-surface-400 mt-1">
            Completion Rate
            <span className="block text-xs text-surface-500">{summary.fullyRead} fully read</span>
          </p>
        </div>
      </div>

      {/* Avg Citations */}
      <div className="glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-3xl font-bold text-surface-100">
            {summary.avgCitations.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </h4>
          <p className="text-sm text-surface-400 mt-1">
            Avg Citations
            <span className="block text-xs text-surface-500">across all domains</span>
          </p>
        </div>
      </div>

      {/* Active Stages */}
      <div className="glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <BarChart size={16} />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-3xl font-bold text-surface-100">{summary.activeStages}</h4>
          <p className="text-sm text-surface-400 mt-1">
            Active Stages
            <span className="block text-xs text-surface-500">of 6 stages used</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
