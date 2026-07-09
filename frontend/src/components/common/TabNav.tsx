import { NavLink } from "react-router-dom";
import { Library, BarChart3, LucideIcon } from "lucide-react";

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

const TabNav = () => {
  return (
    <div className="flex gap-1 p-1 glass-card-sm w-fit mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
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
