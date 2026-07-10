import React, { useRef, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import { IMPACT_SCORES } from "../../papers/schemas/paperValidation.ts";
import { ScatterData } from "../hooks/useAnalyticsQuery.ts";
import { buildScatterOptions } from "./ScatterPlot.config.ts";
import ChartHeader from "./ChartHeader.tsx";
import ChartContainer from "./ChartContainer.tsx";
import { ANALYTICS_STRINGS } from "../constants.ts";

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

  const series = useMemo(() => {
    return IMPACT_SCORES.map((score) => {
      const scoreData = data
        .filter((d) => d.impactScore === score)
        .map((d, index) => ({
          x: d.citationCount,
          y: index + 1,
          name: d._id,
        }));

      return {
        name: score,
        type: "scatter" as const,
        color: IMPACT_COLORS[score],
        data: scoreData,
        marker: {
          radius: 6,
          symbol: "circle",
        },
      };
    });
  }, [data]);

  const options = buildScatterOptions(series);

  return (
    <div className="glass-card p-6 flex flex-col animate-fade-in" style={{ animationDelay: "250ms" }}>
      <ChartHeader title={ANALYTICS_STRINGS.SCATTER_TITLE} subtitle={ANALYTICS_STRINGS.SCATTER_SUBTITLE} />
      <ChartContainer>
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
      </ChartContainer>
    </div>
  );
};

export default ScatterPlot;
