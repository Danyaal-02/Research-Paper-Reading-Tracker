import React, { useRef, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReactModule, { HighchartsReactRefObject } from "highcharts-react-official";
import { READING_STAGES } from "../../papers/schemas/paperValidation.ts";
import { StackedBarData } from "../types.ts";
import { buildStackedBarOptions } from "./StackedBarChart.config.ts";
import ChartHeader from "./ChartHeader.tsx";
import ChartContainer from "./ChartContainer.tsx";
import { ANALYTICS_STRINGS, STAGE_COLORS_MAP } from "../constants.ts";

const HighchartsReact = (
  (HighchartsReactModule as unknown as { default: typeof HighchartsReactModule }).default || 
  HighchartsReactModule
);

interface StackedBarChartProps {
  data: StackedBarData[];
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data = [] }) => {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  const categories = useMemo(() => data.map((d) => d._id), [data]);

  const series = useMemo(() => {
    return READING_STAGES.map((stage) => {
      return {
        name: stage,
        type: "column" as const,
        color: STAGE_COLORS_MAP[stage],
        data: data.map((domainData) => {
          const found = domainData.stages.find((s) => s.stage === stage);
          return found ? found.count : 0;
        }),
      };
    });
  }, [data]);

  const options = buildStackedBarOptions(categories, series);

  return (
    <div className="glass-card p-6 flex flex-col animate-fade-in" style={{ animationDelay: "300ms" }}>
      <ChartHeader title={ANALYTICS_STRINGS.STACKED_TITLE} subtitle={ANALYTICS_STRINGS.STACKED_SUBTITLE} />
      <ChartContainer>
        {data.length > 0 ? (
          <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-surface-500">No data available</div>
        )}
      </ChartContainer>
    </div>
  );
};

export default StackedBarChart;
