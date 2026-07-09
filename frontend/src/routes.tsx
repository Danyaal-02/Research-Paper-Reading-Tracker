import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import RootLayout from "./components/layout/RootLayout.tsx";
import PublicLayout from "./components/layout/PublicLayout.tsx";
import ProtectedLayout from "./components/layout/ProtectedLayout.tsx";
import ErrorBoundary from "./components/layout/ErrorBoundary.tsx";

// Screens
import LoginScreen from "./features/auth/components/LoginScreen.tsx";
import SignupScreen from "./features/auth/components/SignupScreen.tsx";
import PaperLibraryScreen from "./features/papers/components/PaperLibraryScreen.tsx";
import AnalyticsScreen from "./features/analytics/components/AnalyticsScreen.tsx";

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
            element: <LoginScreen />,
          },
          {
            path: "signup",
            element: <SignupScreen />,
          },
        ],
      },
      // Protected routes (Dashboard)
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "library",
            element: <PaperLibraryScreen />,
          },
          {
            path: "analytics",
            element: <AnalyticsScreen />,
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
