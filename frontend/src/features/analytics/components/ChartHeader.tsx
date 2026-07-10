import React from 'react';

interface ChartHeaderProps {
  title: string;
  subtitle: string;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ title, subtitle }) => (
  <div>
    <h3 className="text-base font-semibold text-surface-100">{title}</h3>
    <p className="text-xs text-surface-400 mt-1 mb-2">{subtitle}</p>
  </div>
);

export default ChartHeader;
