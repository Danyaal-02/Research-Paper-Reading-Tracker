import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import api from "./lib/axios.js";

// Common
import Layout from "./components/common/Layout.jsx";
import TabNav from "./components/common/TabNav.jsx";

// Auth
import LoginForm from "./features/auth/components/LoginForm.jsx";
import SignupForm from "./features/auth/components/SignupForm.jsx";

// Papers
import PaperTable from "./features/papers/components/PaperTable.jsx";
import AddPaperModal from "./features/papers/components/AddPaperModal.jsx";
import FilterPanel from "./features/papers/components/FilterPanel.jsx";
import usePapersQuery from "./features/papers/hooks/usePapersQuery.js";

// Analytics
import useAnalyticsQuery from "./features/analytics/hooks/useAnalyticsQuery.js";
import SummaryCards from "./features/analytics/components/SummaryCards.jsx";
import FunnelChart from "./features/analytics/components/FunnelChart.jsx";
import ScatterPlot from "./features/analytics/components/ScatterPlot.jsx";
import StackedBarChart from "./features/analytics/components/StackedBarChart.jsx";

import Button from "./components/ui/Button.jsx";
import { Plus, Filter, Loader2, BookOpen } from "lucide-react";

// ─── Auth Screen ───
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-violet/10 rounded-full blur-3xl" />
      </div>

      <div className="glass-card p-8 w-full max-w-md animate-scale-in relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center animate-pulse-glow">
            <BookOpen size={28} className="text-white" />
          </div>
        </div>

        {isLogin ? (
          <LoginForm onToggle={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggle={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

// ─── Paper Library Tab ───
const PaperLibraryTab = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    readingStage: [],
    researchDomain: [],
    impactScore: [],
    dateRange: "All time",
  });

  const { data, isLoading } = usePapersQuery(filters);
  const papers = data?.papers || [];

  const activeFilterCount =
    (filters.readingStage?.length || 0) +
    (filters.researchDomain?.length || 0) +
    (filters.impactScore?.length || 0) +
    (filters.dateRange && filters.dateRange !== "All time" ? 1 : 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={15} />
          Add Paper
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel filters={filters} onFilterChange={setFilters} />
      )}

      {/* Table */}
      {isLoading ? (
        <div className="glass-card p-12 text-center">
          <Loader2 size={32} className="animate-spin text-primary-400 mx-auto mb-3" />
          <p className="text-surface-400 text-sm">Loading your papers…</p>
        </div>
      ) : (
        <PaperTable papers={papers} />
      )}

      {/* Add Paper Modal */}
      <AddPaperModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

// ─── Analytics Tab ───
const AnalyticsTab = () => {
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

// ─── Main App ───
const App = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("library");

  // Check auth status
  const {
    data: user,
    isLoading: authLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.user;
    },
    retry: false,
    staleTime: Infinity,
  });

  const handleLogout = async () => {
    await api.post("/auth/logout");
    queryClient.clear();
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary-400 mx-auto mb-4" />
          <p className="text-surface-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (isError || !user) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid rgba(148,163,184,0.12)",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
        <AuthScreen />
      </>
    );
  }

  // Authenticated dashboard
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(148,163,184,0.12)",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
      <Layout user={user} onLogout={handleLogout}>
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "library" ? <PaperLibraryTab /> : <AnalyticsTab />}
      </Layout>
    </>
  );
};

export default App;
