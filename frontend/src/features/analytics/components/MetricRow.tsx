import React from 'react';

interface MetricRowProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, valueClassName = 'text-surface-100' }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-surface-300 truncate pr-2">{label}</span>
    <span className={`font-mono ${valueClassName}`}>{value}</span>
  </div>
);

export default MetricRow;
