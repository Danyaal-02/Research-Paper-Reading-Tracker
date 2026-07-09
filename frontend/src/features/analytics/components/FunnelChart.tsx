import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { READING_STAGES } from "../../papers/schemas/paperValidation.ts";
import { FunnelData } from "../hooks/useAnalyticsQuery.ts";

interface FunnelChartProps {
  data: FunnelData[];
}

const STAGE_COLORS: Record<string, string> = {
  "Abstract Read": "#0ea5e9", // sky-500
  "Introduction Done": "#8b5cf6", // violet-500
  "Methodology Done": "#f59e0b", // amber-500
  "Results Analyzed": "#f97316", // orange-500
  "Fully Read": "#10b981", // emerald-500
  "Notes Completed": "#6366f1", // indigo-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-sm px-4 py-3 !bg-surface-800/95 border-surface-700/50">
        <p className="text-sm font-medium text-surface-200 mb-1">{label}</p>
        <p className="text-lg font-bold text-primary-400">
          {payload[0].value} <span className="text-xs font-normal text-surface-400">papers</span>
        </p>
      </div>
    );
  }
  return null;
};

const FunnelChart: React.FC<FunnelChartProps> = ({ data = [] }) => {
  // Ensure all stages exist in order, even if count is 0
  const orderedData = READING_STAGES.map((stage) => {
    const found = data.find((d) => d._id === stage);
    return {
      name: stage.replace(" Done", "").replace(" Completed", "").replace(" Read", ""),
      fullName: stage,
      count: found ? found.count : 0,
    };
  });

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div>
        <h3 className="text-base font-semibold text-surface-100">Reading Funnel</h3>
        <p className="text-xs text-surface-400 mt-1 mb-6">Paper count at each reading stage</p>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={orderedData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.5} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "#475569" }}
              tickLine={{ stroke: "#475569" }}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
              tickLine={{ stroke: "#475569" }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1e293b", opacity: 0.5 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={32}>
              {orderedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.fullName]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FunnelChart;
