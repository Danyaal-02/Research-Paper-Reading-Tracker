import Highcharts from 'highcharts';
import { BASE_DARK_THEME } from './chartTheme.ts';

export const buildStackedBarOptions = (
  categories: string[],
  series: Highcharts.SeriesOptionsType[],
): Highcharts.Options => ({
  ...BASE_DARK_THEME,
  chart: {
    ...BASE_DARK_THEME.chart,
    type: "column",
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
    ...BASE_DARK_THEME.tooltip,
    shared: true,
  },
  legend: {
    itemStyle: { color: "#94a3b8", fontWeight: "normal", fontSize: "11px" },
    itemHoverStyle: { color: "#f8fafc" },
  },
  series,
});
