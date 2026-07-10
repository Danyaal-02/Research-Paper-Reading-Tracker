import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Layouts
import RootLayout from "./components/layout/RootLayout.tsx";
import PublicLayout from "./components/layout/PublicLayout.tsx";
import ProtectedLayout from "./components/layout/ProtectedLayout.tsx";
import ErrorBoundary from "./components/layout/ErrorBoundary.tsx";

// Lazy-loaded Screens
const LoginScreen = lazy(() => import("./features/auth/components/LoginScreen.tsx"));
const SignupScreen = lazy(() => import("./features/auth/components/SignupScreen.tsx"));
const PaperLibraryScreen = lazy(() => import("./features/papers/components/PaperLibraryScreen.tsx"));
const AnalyticsScreen = lazy(() => import("./features/analytics/components/AnalyticsScreen.tsx"));

const LazyFallback = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 size={32} className="animate-spin text-primary-400" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // Public routes (Login / Signup)
      {
        element: <PublicLayout />,
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<LazyFallback />}>
                <LoginScreen />
              </Suspense>
            ),
          },
          {
            path: "signup",
            element: (
              <Suspense fallback={<LazyFallback />}>
                <SignupScreen />
              </Suspense>
            ),
          },
        ],
      },
      // Protected routes (Dashboard)
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "library",
            element: (
              <Suspense fallback={<LazyFallback />}>
                <PaperLibraryScreen />
              </Suspense>
            ),
          },
          {
            path: "analytics",
            element: (
              <Suspense fallback={<LazyFallback />}>
                <AnalyticsScreen />
              </Suspense>
            ),
          },
          // Catch-all redirects to library
          {
            path: "*",
            element: <Navigate to="/library" replace />,
          },
          // Root redirects to library
          {
            index: true,
            element: <Navigate to="/library" replace />,
          }
        ],
      },
    ],
  },
]);
