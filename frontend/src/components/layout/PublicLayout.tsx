import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthQuery } from "../../features/auth/hooks/useAuthQuery.ts";

const PublicLayout = () => {
  const {
    data: user,
    isLoading: authLoading,
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

  // If user is authenticated, prevent access to public routes (login/signup)
  if (user) {
    return <Navigate to="/library" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-violet/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
