import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { IMPACT_SCORES } from "../../papers/schemas/paperValidation.ts";
import { ScatterData } from "../hooks/useAnalyticsQuery.ts";

interface ScatterPlotProps {
  data: ScatterData[];
}

const IMPACT_COLORS: Record<string, string> = {
  "High Impact": "#ef4444", // red-500
  "Medium Impact": "#f59e0b", // amber-500
  "Low Impact": "#10b981", // emerald-500
  Unknown: "#64748b", // slate-500
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card-sm px-4 py-3 !bg-surface-800/95 border-surface-700/50 max-w-[250px]">
        <p className="text-sm font-medium text-surface-100 mb-2 truncate" title={data.name}>
          {data.name}
        </p>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: IMPACT_COLORS[data.impactScore] }}
          />
          <span className="text-xs text-surface-300">{data.impactScore}</span>
        </div>
        <p className="text-sm text-surface-200">
          Citations: <span className="font-mono text-primary-400">{data.citations}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data = [] }) => {
  // Format data for Recharts
  const formattedData = data.map((d, index) => ({
    x: index + 1, // arbitrary x-axis spacing just to spread them out
    citations: d.citationCount,
    impactScore: d.impactScore,
    name: d._id,
  }));

  // Create Legend Payload manually to ensure order
  const legendPayload = IMPACT_SCORES.map((score) => ({
    value: score,
    type: "circle",
    id: score,
    color: IMPACT_COLORS[score],
  }));

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col animate-fade-in" style={{ animationDelay: "250ms" }}>
      <div>
        <h3 className="text-base font-semibold text-surface-100">Citation vs Impact Score</h3>
        <p className="text-xs text-surface-400 mt-1 mb-6">Papers grouped by impact score with citation counts</p>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              type="number"
              dataKey="citations"
              name="Citations"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
              tickLine={{ stroke: "#475569" }}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
            />
            <YAxis
              type="number"
              dataKey="x"
              name="Index"
              hide={true} // Hide arbitrary Y axis since we just want to spread them horizontally
              domain={[0, formattedData.length + 1]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3", stroke: "#475569" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
              payload={legendPayload as any}
            />
            <Scatter name="Papers" data={formattedData} fill="#8884d8">
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={IMPACT_COLORS[entry.impactScore]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterPlot;
