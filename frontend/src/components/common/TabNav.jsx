import { Library, BarChart3 } from "lucide-react";

const tabs = [
  { id: "library", label: "Paper Library", icon: Library },
  { id: "analytics", label: "Reading Analytics", icon: BarChart3 },
];

const TabNav = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 p-1 glass-card-sm w-fit mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-primary-600/90 text-white shadow-lg shadow-primary-600/25"
                : "text-surface-400 hover:text-surface-200 hover:bg-surface-700/30"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabNav;
