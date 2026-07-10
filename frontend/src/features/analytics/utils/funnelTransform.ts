import { FunnelData } from '../hooks/useAnalyticsQuery.ts';
import { FUNNEL_STAGES } from '../constants.ts';

export function computeCumulativeFunnel(data: FunnelData[]) {
  const counts = new Array(FUNNEL_STAGES.length).fill(0);
  
  data.forEach((item) => {
    const idx = FUNNEL_STAGES.indexOf(item._id as any);
    if (idx !== -1) {
      for (let i = 0; i <= idx; i++) {
        counts[i] += item.count;
      }
    }
  });

  return {
    chartData: FUNNEL_STAGES.map((stage, i) => [stage, counts[i]]),
    peakCount: counts[0] || 1,
  };
}
