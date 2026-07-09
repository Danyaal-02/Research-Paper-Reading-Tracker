import { BookOpen, BarChart3, CheckCircle2, TrendingUp } from "lucide-react";

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const { byStage = [], avgCitationsByDomain = [], completionRate = {} } = summary;

  const totalPapers = completionRate.total || 0;
  const rate = completionRate.rate || 0;

  // Calculate overall average citations
  const overallAvgCitations =
    avgCitationsByDomain.length > 0
      ? (
          avgCitationsByDomain.reduce((sum, d) => sum + d.avgCitations, 0) /
          avgCitationsByDomain.length
        ).toFixed(1)
      : "0";

  const cards = [
    {
      title: "Total Papers",
      value: totalPapers,
      icon: BookOpen,
      gradient: "from-primary-500 to-primary-700",
      iconBg: "bg-primary-500/20",
    },
    {
      title: "Completion Rate",
      value: `${rate}%`,
      subtitle: `${completionRate.fullyRead || 0} fully read`,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-emerald-700",
      iconBg: "bg-emerald-500/20",
    },
    {
      title: "Avg Citations",
      value: overallAvgCitations,
      subtitle: "across all domains",
      icon: TrendingUp,
      gradient: "from-amber-500 to-amber-700",
      iconBg: "bg-amber-500/20",
    },
    {
      title: "Active Stages",
      value: byStage.length,
      subtitle: "of 6 stages used",
      icon: BarChart3,
      gradient: "from-violet-500 to-violet-700",
      iconBg: "bg-violet-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="glass-card-sm p-5 animate-fade-in hover:border-primary-500/20 transition-colors"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}
              >
                <Icon size={20} className={`bg-gradient-to-r ${card.gradient} bg-clip-text`} style={{ color: `var(--tw-gradient-from)` }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-surface-100 mb-0.5">
              {card.value}
            </div>
            <div className="text-sm text-surface-400">{card.title}</div>
            {card.subtitle && (
              <div className="text-xs text-surface-500 mt-1">{card.subtitle}</div>
            )}
          </div>
        );
      })}

      {/* Avg Citations by Domain breakdown */}
      {avgCitationsByDomain.length > 0 && (
        <div className="sm:col-span-2 lg:col-span-4 glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "320ms" }}>
          <h4 className="text-sm font-semibold text-surface-300 mb-3">
            Average Citations per Domain
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {avgCitationsByDomain.map((d) => (
              <div key={d.domain} className="text-center p-3 rounded-lg bg-surface-800/40">
                <div className="text-lg font-bold text-surface-100">
                  {d.avgCitations}
                </div>
                <div className="text-xs text-surface-500 mt-0.5">{d.domain}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Papers by Reading Stage */}
      {byStage.length > 0 && (
        <div className="sm:col-span-2 lg:col-span-4 glass-card-sm p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h4 className="text-sm font-semibold text-surface-300 mb-3">
            Papers by Reading Stage
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {byStage.map((s) => (
              <div key={s.stage} className="text-center p-3 rounded-lg bg-surface-800/40">
                <div className="text-lg font-bold text-surface-100">
                  {s.count}
                </div>
                <div className="text-xs text-surface-500 mt-0.5">{s.stage}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCards;
