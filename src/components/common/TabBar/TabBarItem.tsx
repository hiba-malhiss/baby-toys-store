import React from 'react';

type TabBarItemProps = {
  value: string;
  children: React.ReactNode;
};

export const TabBarItem = ({ value, children }: TabBarItemProps) => {
  return (
    <div data-value={value} style={{ width: '100%' }}>
      {children}
    </div>
  );
};
