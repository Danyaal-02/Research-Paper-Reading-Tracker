import Highcharts from 'highcharts';
import { BASE_DARK_THEME } from './chartTheme.ts';
import { FUNNEL_STAGE_COLORS } from '../constants.ts';

export const buildFunnelOptions = (
  chartData: any[],
  peakCount: number
): Highcharts.Options => ({
  ...BASE_DARK_THEME,
  chart: {
    ...BASE_DARK_THEME.chart,
    type: "funnel",
  },
  plotOptions: {
    funnel: {
      neckWidth: "25%",
      neckHeight: "30%",
      width: "80%",
      colors: FUNNEL_STAGE_COLORS,
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
    ...BASE_DARK_THEME.tooltip,
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
});
