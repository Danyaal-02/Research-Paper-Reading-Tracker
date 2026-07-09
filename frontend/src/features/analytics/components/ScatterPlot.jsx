import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const IMPACT_CONFIG = {
  "High Impact": { color: "#DC2626", label: "High Impact" },
  "Medium Impact": { color: "#F59E0B", label: "Medium Impact" },
  "Low Impact": { color: "#10B981", label: "Low Impact" },
  Unknown: { color: "#64748B", label: "Unknown" },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload;
    return (
      <div className="glass-card-sm px-3 py-2 text-sm max-w-xs">
        <p className="text-surface-100 font-medium truncate">{data.title}</p>
        <p className="text-surface-400">Citations: {data.citationCount}</p>
        <p className="text-surface-400">Impact: {data.impactScore}</p>
      </div>
    );
  }
  return null;
};

const ScatterPlot = ({ data = [] }) => {
  // Group data by impact score
  const groupedData = {};
  for (const item of data) {
    const impact = item.impactScore || "Unknown";
    if (!groupedData[impact]) groupedData[impact] = [];
    groupedData[impact].push({
      ...item,
      // Add a small vertical jitter for overlapping points
      yIndex: groupedData[impact].length,
    });
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-base font-semibold text-surface-200 mb-4">
          Citation vs Impact Score
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
        Citation vs Impact Score
      </h3>
      <p className="text-xs text-surface-500 mb-4">
        Papers grouped by impact score with citation counts
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis
            dataKey="citationCount"
            name="Citations"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            label={{
              value: "Citation Count",
              position: "insideBottom",
              offset: -5,
              style: { fill: "#64748b", fontSize: 12 },
            }}
          />
          <YAxis
            dataKey="yIndex"
            name="Index"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            label={{
              value: "Papers",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#64748b", fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
          />
          {Object.entries(IMPACT_CONFIG).map(([impact, config]) => {
            const impactData = groupedData[impact];
            if (!impactData?.length) return null;
            return (
              <Scatter
                key={impact}
                name={config.label}
                data={impactData}
                fill={config.color}
                fillOpacity={0.8}
                r={6}
              />
            );
          })}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
