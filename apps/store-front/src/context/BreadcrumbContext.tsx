import React, { createContext, useContext, useState } from 'react';
import type { BreadcrumbItemData } from '@baby-toys/ui-kit/components';

interface BreadcrumbContextType {
  extraCrumbs: BreadcrumbItemData[] | null;
  setExtraCrumbs: (crumb: BreadcrumbItemData[] | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  extraCrumbs: null,
  setExtraCrumbs: () => {},
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [extraCrumbs, setExtraCrumbs] = useState<BreadcrumbItemData[] | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ extraCrumbs, setExtraCrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
