import React from "react";

type BadgeType = "stage" | "impact" | "domain";

interface BadgeProps {
  children: React.ReactNode;
  type?: BadgeType;
  className?: string;
}

const stageColors: Record<string, string> = {
  "Abstract Read": "bg-sky-500/15 text-sky-400 border border-sky-500/20",
  "Introduction Done": "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  "Methodology Done": "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  "Results Analyzed": "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  "Fully Read": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  "Notes Completed": "bg-primary-500/15 text-primary-400 border border-primary-500/20",
};

const impactColors: Record<string, string> = {
  "High Impact": "bg-red-500/15 text-red-400 border border-red-500/20",
  "Medium Impact": "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  "Low Impact": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Unknown: "bg-surface-500/15 text-surface-400 border border-surface-500/20",
};

const domainColors: Record<string, string> = {
  "Computer Science": "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  Biology: "bg-green-500/15 text-green-400 border border-green-500/20",
  Physics: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  Chemistry: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  Mathematics: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
  "Social Sciences": "bg-pink-500/15 text-pink-400 border border-pink-500/20",
};

const Badge: React.FC<BadgeProps> = ({ children, type = "stage", className = "" }) => {
  let colorMap: Record<string, string>;
  switch (type) {
    case "impact":
      colorMap = impactColors;
      break;
    case "domain":
      colorMap = domainColors;
      break;
    default:
      colorMap = stageColors;
  }

  const color = typeof children === 'string' && colorMap[children] ? colorMap[children] : "bg-surface-500/15 text-surface-400";

  return (
    <span className={`badge ${color} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
