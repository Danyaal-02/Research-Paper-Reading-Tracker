import React, { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import FunnelModule from "highcharts/modules/funnel";
import { FunnelData } from "../hooks/useAnalyticsQuery.ts";
import { computeCumulativeFunnel } from "../utils/funnelTransform.ts";
import { buildFunnelOptions } from "./FunnelChart.config.ts";
import ChartHeader from "./ChartHeader.tsx";
import ChartContainer from "./ChartContainer.tsx";
import { ANALYTICS_STRINGS } from "../constants.ts";

const HighchartsReact = (HighchartsReactModule as any).default || HighchartsReactModule;

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

const FunnelChart: React.FC<FunnelChartProps> = ({ data = [] }) => {
  const chartRef = useRef<any>(null);

  const { chartData, peakCount } = computeCumulativeFunnel(data);
  const options = buildFunnelOptions(chartData, peakCount);

  return (
    <div className="glass-card p-6 flex flex-col animate-fade-in" style={{ animationDelay: "200ms" }}>
      <ChartHeader title={ANALYTICS_STRINGS.FUNNEL_TITLE} subtitle={ANALYTICS_STRINGS.FUNNEL_SUBTITLE} />
      <ChartContainer>
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
      </ChartContainer>
    </div>
  );
};

export default FunnelChart;
