import React from 'react';

interface ChartContainerProps {
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children }) => (
  <div className="w-full h-87.5 overflow-hidden">{children}</div>
);

export default ChartContainer;
