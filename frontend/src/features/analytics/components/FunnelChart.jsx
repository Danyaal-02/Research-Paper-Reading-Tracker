import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

// Ordered reading stages for funnel flow
const STAGE_ORDER = [
  "Abstract Read",
  "Introduction Done",
  "Methodology Done",
  "Results Analyzed",
  "Fully Read",
  "Notes Completed",
];

const STAGE_COLORS = [
  "#0ea5e9", // sky
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#f97316", // orange
  "#10b981", // emerald
  "#6366f1", // indigo
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.[0]) {
    return (
      <div className="glass-card-sm px-3 py-2 text-sm">
        <p className="text-surface-100 font-medium">{payload[0].payload.stage}</p>
        <p className="text-surface-400">
          {payload[0].value} paper{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
};

const FunnelChart = ({ data = [] }) => {
  // Reorder data to match the funnel flow
  const orderedData = STAGE_ORDER.map((stage) => {
    const found = data.find((d) => d.stage === stage);
    return { stage, count: found?.count || 0 };
  });

  if (data.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-base font-semibold text-surface-200 mb-4">
          Reading Funnel
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
        Reading Funnel
      </h3>
      <p className="text-xs text-surface-500 mb-4">
        Paper count at each reading stage
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={orderedData} layout="vertical" margin={{ left: 20, right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
          <YAxis
            dataKey="stage"
            type="category"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            width={130}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={32}>
            {orderedData.map((_, idx) => (
              <Cell key={idx} fill={STAGE_COLORS[idx]} fillOpacity={0.85} />
            ))}
            <LabelList dataKey="count" position="right" fill="#94a3b8" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;
