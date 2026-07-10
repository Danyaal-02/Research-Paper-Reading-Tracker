import Highcharts from 'highcharts';
import { CHART_HEIGHT_PX } from '../constants.ts';

export const BASE_DARK_THEME: Partial<Highcharts.Options> = {
  chart: {
    backgroundColor: 'transparent',
    style: { fontFamily: 'inherit' },
    height: CHART_HEIGHT_PX,
    reflow: true,
  },
  title: { text: undefined },
  tooltip: {
    useHTML: true,
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    style: { color: '#f1f5f9' },
  },
  credits: { enabled: false },
};
