import React, { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import { IMPACT_SCORES } from "../../papers/schemas/paperValidation.ts";
import { ScatterData } from "../hooks/useAnalyticsQuery.ts";

const HighchartsReact = (HighchartsReactModule as any).default || HighchartsReactModule;

interface ScatterPlotProps {
  data: ScatterData[];
}

const IMPACT_COLORS: Record<string, string> = {
  "High Impact": "#ef4444", // red-500
  "Medium Impact": "#f59e0b", // amber-500
  "Low Impact": "#10b981", // emerald-500
  Unknown: "#64748b", // slate-500
};

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data = [] }) => {
  const chartRef = useRef<any>(null);

  // Highcharts expects series arrays for scatter grouping
  const series = IMPACT_SCORES.map((score) => {
    // Filter data for this specific impact score
    const scoreData = data
      .filter((d) => d.impactScore === score)
      .map((d, index) => ({
        x: d.citationCount,
        y: index + 1, // Arbitrary Y to spread them vertically
        name: d._id,
      }));

    return {
      name: score,
      type: "scatter",
      color: IMPACT_COLORS[score],
      data: scoreData,
      marker: {
        radius: 6,
        symbol: "circle",
      },
    };
  });

  const options: Highcharts.Options = {
    chart: {
      type: "scatter",
      backgroundColor: "transparent",
      style: { fontFamily: "inherit" },
      height: 350,
      reflow: true,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      title: {
        text: 'Citations',
        style: { color: '#9CA3AF' }
      },
      labels: {
        style: { color: '#9CA3AF', fontSize: "11px" },
        formatter: function () {
          const val = this.value as number;
          return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toString();
        },
      },
      lineColor: "#475569",
      tickColor: "#475569",
      gridLineWidth: 1,
      gridLineColor: 'rgba(156, 163, 175, 0.15)',
      gridLineDashStyle: 'Dash',
    },
    yAxis: {
      title: { text: undefined },
      visible: false, // Hide Y axis as it's just for spreading
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#1e293b",
      borderColor: "#334155",
      style: { color: "#f1f5f9" },
      formatter: function (this: any) {
        return `
          <div style="text-align: center; font-family: inherit;">
            <b style="display: block; margin-bottom: 4px;">${this.point.name}</b>
            <span style="color: #94a3b8">Citations:</span> <b style="color: ${this.series.color}">${this.x}</b><br/>
            <span style="color: #94a3b8">Impact:</span> <b>${this.series.name}</b>
          </div>
        `;
      },
    },
    legend: {
      itemStyle: { color: "#94a3b8", fontWeight: "normal", fontSize: "11px" },
      itemHoverStyle: { color: "#f8fafc" },
      verticalAlign: "bottom",
    },
    series: series as any,
    credits: { enabled: false },
  };

  return (
    <div className="glass-card p-6 flex flex-col animate-fade-in" style={{ animationDelay: "250ms" }}>
      <div>
        <h3 className="text-base font-semibold text-surface-100">Citation vs Impact Score</h3>
        <p className="text-xs text-surface-400 mt-1 mb-2">Papers grouped by impact score with citation counts</p>
      </div>
      <div className="w-full h-[350px] overflow-hidden">
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default ScatterPlot;
