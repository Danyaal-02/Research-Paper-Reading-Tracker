import { NavLink } from "react-router-dom";
import { Library, BarChart3, LucideIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios.ts";
import { API_ROUTES } from "../../lib/apiRoutes.ts";

interface Tab {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: "library", path: "/library", label: "Paper Library", icon: Library },
  { id: "analytics", path: "/analytics", label: "Reading Analytics", icon: BarChart3 },
];

// Centralized route asset prefetches
const prefetchModules: Record<string, () => Promise<any>> = {
  analytics: () => import("../../features/analytics/components/AnalyticsScreen.tsx"),
  library: () => import("../../features/papers/components/PaperLibraryScreen.tsx"),
  settings: () => Promise.resolve(),
  dashboard: () => Promise.resolve(),
};

const TabNav = () => {
  const queryClient = useQueryClient();

  const handleMouseEnter = (id: string) => {
    // Trigger premature browser cache ingestion for the dynamic component module
    if (prefetchModules[id]) {
      prefetchModules[id]();
    }

    if (id === "analytics") {
      // Prefetch analytics API data in react-query
      queryClient.prefetchQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
          const { data } = await api.get(API_ROUTES.ANALYTICS);
          return data.data;
        },
      });
    } else if (id === "library") {
      // Prefetch library API data in react-query
      queryClient.prefetchInfiniteQuery({
        queryKey: ["papers", {}],
        queryFn: async ({ pageParam = 1 }) => {
          const { data } = await api.get(`${API_ROUTES.PAPERS}?page=${pageParam}&limit=10`);
          return data;
        },
        initialPageParam: 1,
      });
    }
  };

  return (
    <div className="flex gap-1 p-1 glass-card-sm w-fit mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            onMouseEnter={() => handleMouseEnter(tab.id)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary-600/90 text-white shadow-lg shadow-primary-600/25"
                  : "text-surface-400 hover:text-surface-200 hover:bg-surface-700/30"
              }`
            }
          >
            <Icon size={16} />
            {tab.label}
          </NavLink>
        );
      })}
    </div>
  );
};

export default TabNav;

