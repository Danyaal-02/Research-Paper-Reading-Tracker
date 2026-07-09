import React from "react";
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
import { READING_STAGES } from "../../papers/schemas/paperValidation.ts";
import { StackedBarData } from "../hooks/useAnalyticsQuery.ts";

interface StackedBarChartProps {
  data: StackedBarData[];
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
    const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
    return (
      <div className="glass-card-sm px-4 py-3 !bg-surface-800/95 border-surface-700/50 min-w-[200px]">
        <p className="text-sm font-bold text-surface-100 mb-2 border-b border-surface-700/50 pb-2">
          {label} <span className="text-surface-400 font-normal float-right">({total})</span>
        </p>
        <div className="flex flex-col gap-1.5">
          {payload
            .filter((entry: any) => entry.value > 0)
            .reverse() // Reverse to match visual stacking order
            .map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-surface-300">{entry.name}</span>
                </div>
                <span className="font-mono text-surface-100">{entry.value}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data = [] }) => {
  // Transform data: flatten the `stages` array into object properties for Recharts
  const formattedData = data.map((d) => {
    const item: Record<string, any> = { domain: d._id };
    // Initialize all stages to 0
    READING_STAGES.forEach((stage) => {
      item[stage] = 0;
    });
    // Populate actual counts
    d.stages.forEach((s) => {
      item[s.stage] = s.count;
    });
    return item;
  });

  return (
    <div className="glass-card p-6 h-[450px] flex flex-col animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div>
        <h3 className="text-base font-semibold text-surface-100">Papers by Domain & Stage</h3>
        <p className="text-xs text-surface-400 mt-1 mb-6">Stacked view of reading progress across research domains</p>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="domain"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1e293b", opacity: 0.5 }} />
            <Legend
              verticalAlign="bottom"
              height={20}
              iconType="square"
              wrapperStyle={{ fontSize: "11px", color: "#94a3b8", paddingTop: "20px" }}
            />
            {READING_STAGES.map((stage) => (
              <Bar
                key={stage}
                dataKey={stage}
                stackId="a"
                fill={STAGE_COLORS[stage]}
                maxBarSize={60}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedBarChart;
