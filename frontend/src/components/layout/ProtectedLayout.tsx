import { Navigate, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import api from "../../lib/axios.ts";
import Layout from "../common/Layout.tsx";
import TabNav from "../common/TabNav.tsx";
import { useAuthQuery } from "../../features/auth/hooks/useAuthQuery.ts";

const ProtectedLayout = () => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: authLoading,
    isError,
  } = useAuthQuery();

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

  // If not authenticated, redirect to login
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await api.post("/auth/logout");
    queryClient.clear();
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <TabNav />
      <Outlet />
    </Layout>
  );
};

export default ProtectedLayout;
