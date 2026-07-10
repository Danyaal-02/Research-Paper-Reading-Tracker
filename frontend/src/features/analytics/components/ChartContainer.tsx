import React from 'react';

const ChartContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full h-87.5 overflow-hidden">{children}</div>
);

export default ChartContainer;
