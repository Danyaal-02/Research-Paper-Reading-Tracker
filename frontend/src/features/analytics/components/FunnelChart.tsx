import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import FunnelModule from "highcharts/modules/funnel";
import { READING_STAGES } from "../../papers/schemas/paperValidation.ts";
import { FunnelData } from "../hooks/useAnalyticsQuery.ts";

const HighchartsReact = (HighchartsReactModule as any).default || HighchartsReactModule;

// Initialize the Funnel module safely for Vite/ESM
if (typeof Highcharts === "object") {
  const initModule = (mod: any) => {
    if (typeof mod === "function") mod(Highcharts);
    else if (mod && typeof mod.default === "function") mod.default(Highcharts);
  };
  initModule(FunnelModule);
}

interface FunnelChartProps {
  data: FunnelData[];
}

const STAGES = [
  "Abstract Read",
  "Introduction Done",
  "Methodology Done",
  "Results Analyzed",
  "Fully Read",
  "Notes Completed",
];

const STAGE_COLORS = [
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500
  "#d946ef", // fuchsia-500
];

const FunnelChart: React.FC<FunnelChartProps> = ({ data = [] }) => {
  const chartRef = useRef<any>(null);

  // 1. Comprehensive Data Transformation Logic
  const cumulativeCounts = new Array(STAGES.length).fill(0);

  // Compute cumulative values programmatically
  data.forEach((item) => {
    const stageIndex = STAGES.indexOf(item._id);
    if (stageIndex !== -1) {
      // If a paper is at this stage, it automatically increments counts for all preceding stages
      for (let i = 0; i <= stageIndex; i++) {
        cumulativeCounts[i] += item.count;
      }
    }
  });

  const chartData = STAGES.map((stage, index) => [
    stage,
    cumulativeCounts[index],
  ]);

  const peakCount = cumulativeCounts[0] || 1; // Baseline for conversion percentages

  // 2. & 3. Highcharts Traditional Funnel Architecture & Dark Mode Styling
  const options: Highcharts.Options = {
    chart: {
      type: "funnel",
      backgroundColor: "transparent",
      style: { fontFamily: "inherit" },
      height: 350,
      reflow: true,
    },
    title: {
      text: undefined,
    },
    plotOptions: {
      funnel: {
        neckWidth: "25%",
        neckHeight: "30%",
        width: "80%",
        colors: STAGE_COLORS,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          color: "#F3F4F6",
          style: {
            textOutline: "none",
            fontSize: "12px",
            fontWeight: "500",
          },
          connectorColor: "#475569",
        },
      },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#1e293b",
      borderColor: "#334155",
      style: { color: "#f1f5f9" },
      formatter: function (this: any) {
        const percentage = ((this.y / peakCount) * 100).toFixed(1);
        return `
          <div style="text-align: center; font-family: inherit;">
            <b style="color: ${this.color}; display: block; margin-bottom: 4px;">${this.key}</b>
            <span style="color: #94a3b8">Count:</span> <b>${this.y}</b><br/>
            <span style="color: #94a3b8">Retention:</span> <b>${percentage}%</b>
          </div>
        `;
      },
    },
    series: [
      {
        type: "funnel",
        name: "Papers",
        data: chartData,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="glass-card p-6 flex flex-col animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div>
        <h3 className="text-base font-semibold text-surface-100">Reading Funnel</h3>
        <p className="text-xs text-surface-400 mt-1 mb-2">Cumulative pipeline progression</p>
      </div>
      <div className="w-full h-[350px] overflow-hidden">
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default FunnelChart;
