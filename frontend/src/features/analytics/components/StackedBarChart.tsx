import React, { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import { READING_STAGES } from "../../papers/schemas/paperValidation.ts";
import { StackedBarData } from "../hooks/useAnalyticsQuery.ts";

const HighchartsReact = (HighchartsReactModule as any).default || HighchartsReactModule;

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

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data = [] }) => {
  const chartRef = useRef<any>(null);

  // Extract all domains for x-axis categories
  const categories = data.map((d) => d._id);

  // Build series data for each stage
  const series = READING_STAGES.map((stage) => {
    return {
      name: stage,
      type: "column",
      color: STAGE_COLORS[stage],
      data: data.map((domainData) => {
        const found = domainData.stages.find((s) => s.stage === stage);
        return found ? found.count : 0;
      }),
    };
  });

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      style: { fontFamily: "inherit" },
      height: 350,
      reflow: true,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories,
      labels: {
        style: { color: "#94a3b8", fontSize: "11px" },
      },
      lineColor: "#475569",
      tickColor: "#475569",
    },
    yAxis: {
      title: { text: undefined },
      labels: {
        style: { color: "#94a3b8", fontSize: "12px" },
      },
      gridLineColor: "#334155",
      gridLineDashStyle: "Dash",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        borderWidth: 0,
        maxPointWidth: 60,
      },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#1e293b",
      borderColor: "#334155",
      style: { color: "#f1f5f9" },
      shared: true,
    },
    legend: {
      itemStyle: { color: "#94a3b8", fontWeight: "normal", fontSize: "11px" },
      itemHoverStyle: { color: "#f8fafc" },
    },
    series: series as any,
    credits: { enabled: false },
  };

  return (
    <div className="glass-card p-6 flex flex-col animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div>
        <h3 className="text-base font-semibold text-surface-100">Papers by Domain & Stage</h3>
        <p className="text-xs text-surface-400 mt-1 mb-2">Stacked view of reading progress across research domains</p>
      </div>
      <div className="w-full h-[350px] overflow-hidden">
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default StackedBarChart;
