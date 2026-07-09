import { Loader2 } from "lucide-react";
import useAnalyticsQuery from "../hooks/useAnalyticsQuery";
import SummaryCards from "./SummaryCards";
import FunnelChart from "./FunnelChart";
import ScatterPlot from "./ScatterPlot";
import StackedBarChart from "./StackedBarChart";

const AnalyticsScreen = () => {
  const { data, isLoading } = useAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="glass-card p-12 text-center">
        <Loader2 size={32} className="animate-spin text-primary-400 mx-auto mb-3" />
        <p className="text-surface-400 text-sm">Loading analytics…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-surface-400 text-sm">No analytics data available. Add some papers first!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <SummaryCards summary={data.summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelChart data={data.funnel} />
        <ScatterPlot data={data.scatter} />
      </div>
      <StackedBarChart data={data.stackedBar} />
    </div>
  );
};

export default AnalyticsScreen;
