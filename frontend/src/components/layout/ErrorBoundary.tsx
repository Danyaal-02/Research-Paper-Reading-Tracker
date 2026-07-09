import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route Error:", error);

  let errorMessage = "An unexpected error occurred";
  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-900 text-surface-50">
      <div className="glass-card max-w-md w-full p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-400">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-surface-100 mb-2">Oops! Something went wrong.</h1>
        <p className="text-surface-400 mb-8">{errorMessage}</p>
        <Link to="/">
          <Button variant="primary" className="w-full justify-center">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;
