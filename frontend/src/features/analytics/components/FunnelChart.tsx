import React, { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReactModule, { HighchartsReactRefObject } from "highcharts-react-official";
import FunnelModule from "highcharts/modules/funnel";
import { FunnelData } from "../types.ts";
import { computeCumulativeFunnel } from "../utils/funnelTransform.ts";
import { buildFunnelOptions } from "./FunnelChart.config.ts";
import ChartHeader from "./ChartHeader.tsx";
import ChartContainer from "./ChartContainer.tsx";
import { ANALYTICS_STRINGS } from "../constants.ts";

const HighchartsReact = (
  (HighchartsReactModule as unknown as { default: typeof HighchartsReactModule }).default || 
  HighchartsReactModule
);

if (typeof Highcharts === "object") {
  const initModule = (mod: unknown) => {
    if (typeof mod === "function") mod(Highcharts);
    else if (mod && typeof mod === "object" && "default" in mod && typeof (mod as { default: Function }).default === "function") (mod as { default: Function }).default(Highcharts);
  };
  initModule(FunnelModule);
}

interface FunnelChartProps {
  data: FunnelData[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data = [] }) => {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  const { chartData, peakCount } = computeCumulativeFunnel(data);
  const options = buildFunnelOptions(chartData, peakCount);

  return (
    <div className="glass-card p-6 flex flex-col animate-fade-in" style={{ animationDelay: "200ms" }}>
      <ChartHeader title={ANALYTICS_STRINGS.FUNNEL_TITLE} subtitle={ANALYTICS_STRINGS.FUNNEL_SUBTITLE} />
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

export default FunnelChart;
