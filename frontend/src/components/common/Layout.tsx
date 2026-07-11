import React from "react";
import { BookOpen, LogOut } from "lucide-react";
import Button from "../ui/Button.tsx";

interface User {
  email: string;
}

interface LayoutProps {
  user: User | null | undefined;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card-sm top-0 z-40 mx-4 mt-4 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary-500 to-accent-violet flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold gradient-text">Research Tracker</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-surface-400 hidden sm:block">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
