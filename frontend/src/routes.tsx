import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense, ComponentType } from "react";
import { Loader2 } from "lucide-react";

// Layouts
import RootLayout from "./components/layout/RootLayout.tsx";
import PublicLayout from "./components/layout/PublicLayout.tsx";
import ProtectedLayout from "./components/layout/ProtectedLayout.tsx";
import ErrorBoundary from "./components/layout/ErrorBoundary.tsx";

// Async Module Interceptor
function lazyWithRetry(componentImport: () => Promise<{ default: ComponentType<any> }>) {
  return () => componentImport().catch((error) => {
    // Check if the network chunk file is missing or cached incorrectly
    const isChunkLoadFailed = error.message && (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Loading chunk')
    );
    
    if (isChunkLoadFailed) {
      window.location.reload();
      return { default: () => null }; // Return placeholder layout while page refreshes
    }
    
    throw error; // Let unrelated application runtime exceptions bubble up normally
  });
}

// Lazy-loaded Screens
const LoginScreen = lazy(lazyWithRetry(() => import("./features/auth/components/LoginScreen.tsx")));
const SignupScreen = lazy(lazyWithRetry(() => import("./features/auth/components/SignupScreen.tsx")));
const PaperLibraryScreen = lazy(lazyWithRetry(() => import("./features/papers/components/PaperLibraryScreen.tsx")));
const AnalyticsScreen = lazy(lazyWithRetry(() => import("./features/analytics/components/AnalyticsScreen.tsx")));

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
