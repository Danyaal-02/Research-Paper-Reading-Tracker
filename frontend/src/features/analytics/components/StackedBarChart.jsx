import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const READING_STAGES = [
  "Abstract Read",
  "Introduction Done",
  "Methodology Done",
  "Results Analyzed",
  "Fully Read",
  "Notes Completed",
];

const STAGE_COLORS = {
  "Abstract Read": "#0ea5e9",
  "Introduction Done": "#8b5cf6",
  "Methodology Done": "#f59e0b",
  "Results Analyzed": "#f97316",
  "Fully Read": "#10b981",
  "Notes Completed": "#6366f1",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card-sm px-3 py-2 text-sm">
        <p className="text-surface-100 font-medium mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StackedBarChart = ({ data = [] }) => {
  // Transform data: each domain has stage counts as separate keys
  const chartData = data.map((item) => {
    const row = { domain: item.domain };
    for (const stage of READING_STAGES) {
      const found = item.stages?.find((s) => s.stage === stage);
      row[stage] = found?.count || 0;
    }
    return row;
  });

  if (data.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-base font-semibold text-surface-200 mb-4">
          Papers by Domain & Stage
        </h3>
        <div className="flex items-center justify-center h-48 text-surface-500 text-sm">
          No data available yet
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-base font-semibold text-surface-200 mb-1">
        Papers by Domain & Stage
      </h3>
      <p className="text-xs text-surface-500 mb-4">
        Stacked view of reading progress across research domains
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis
            dataKey="domain"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            allowDecimals={false}
            label={{
              value: "Paper Count",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#64748b", fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
          {READING_STAGES.map((stage) => (
            <Bar
              key={stage}
              dataKey={stage}
              stackId="a"
              fill={STAGE_COLORS[stage]}
              fillOpacity={0.85}
              radius={stage === "Notes Completed" ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
