import React from "react";
import { BookOpen, CheckCircle2, TrendingUp, BarChart } from "lucide-react";
import { AnalyticsSummary } from "../hooks/useAnalyticsQuery.ts";

interface SummaryCardsProps {
  summary: AnalyticsSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Overview & Completion */}
      <div className="glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "0ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <BookOpen size={16} />
          </div>
          <h3 className="text-surface-100 font-semibold">Library Overview</h3>
        </div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="text-3xl font-bold text-surface-100">{summary.totalPapers}</h4>
            <p className="text-sm text-surface-400 mt-1">Total Papers</p>
          </div>
          <div className="text-right">
            <h4 className="text-2xl font-bold text-emerald-400">{summary.completionRate}%</h4>
            <p className="text-xs text-surface-400 mt-1">Completion Rate</p>
          </div>
        </div>
        <div className="bg-surface-800/50 rounded p-2 text-xs text-surface-400 text-center">
          <span className="text-emerald-400 font-medium">{summary.fullyRead}</span> papers fully read
        </div>
      </div>

      {/* Papers By Stage */}
      <div className="glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <BarChart size={16} />
          </div>
          <h3 className="text-surface-100 font-semibold">Papers By Stage</h3>
        </div>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          {summary.papersByStage.length > 0 ? (
            summary.papersByStage.map((s) => (
              <div key={s.stage} className="flex justify-between items-center text-sm">
                <span className="text-surface-300 truncate pr-2">{s.stage}</span>
                <span className="font-mono text-surface-100">{s.count}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-surface-500 text-center py-2">No papers tracked</p>
          )}
        </div>
      </div>

      {/* Average Citations By Domain */}
      <div className="glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
          <h3 className="text-surface-100 font-semibold">Avg Citations / Domain</h3>
        </div>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          {summary.avgCitationsPerDomain.length > 0 ? (
            summary.avgCitationsPerDomain.map((d) => (
              <div key={d.domain} className="flex justify-between items-center text-sm">
                <span className="text-surface-300 truncate pr-2">{d.domain}</span>
                <span className="font-mono text-amber-400">{d.avg}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-surface-500 text-center py-2">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
