import useAnalyticsQuery from "../hooks/useAnalyticsQuery";
import SummaryCards from "./SummaryCards";
import FunnelChart from "./FunnelChart";
import ScatterPlot from "./ScatterPlot";
import StackedBarChart from "./StackedBarChart";
import { Skeleton } from "../../../components/ui/Skeleton";

const ChartSkeleton = () => (
  <div className="glass-card p-6 flex items-center justify-center" style={{ minHeight: "400px" }}>
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="w-8 h-8 rounded-full border-2 border-surface-500 border-t-transparent animate-spin absolute"></div>
    </div>
  </div>
);

const SummaryCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="glass-card-sm p-5 flex flex-col justify-between" style={{ minHeight: "150px" }}>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex justify-between items-end">
          <div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-6 w-12 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AnalyticsScreen = () => {
  const { data, isLoading } = useAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <SummaryCardsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
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
    <div className="flex flex-col gap-6 pb-10">
      <SummaryCards summary={data.summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelChart data={data.funnel} />
        <ScatterPlot data={data.scatter} />
      </div>
      <StackedBarChart data={data.stackedBar} />
    </div>
  );
};

export default AnalyticsScreen;
