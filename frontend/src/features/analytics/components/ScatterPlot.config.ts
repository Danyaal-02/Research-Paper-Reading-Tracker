import Highcharts from 'highcharts';
import { BASE_DARK_THEME } from './chartTheme.ts';

export const buildScatterOptions = (
  series: Highcharts.SeriesOptionsType[],
): Highcharts.Options => ({
  ...BASE_DARK_THEME,
  chart: {
    ...BASE_DARK_THEME.chart,
    type: "scatter",
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
    visible: false,
  },
  tooltip: {
    ...BASE_DARK_THEME.tooltip,
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
  series,
});
