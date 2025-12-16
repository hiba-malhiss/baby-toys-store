import { createContext, useContext, useState, type ReactNode } from 'react';
import type { BreadcrumbItemData } from '../components';

type BreadcrumbContextType = {
  extraCrumbs: BreadcrumbItemData[] | null;
  setExtraCrumbs: (crumbs: BreadcrumbItemData[] | null) => void;
};

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  extraCrumbs: null,
  setExtraCrumbs: () => {},
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [extraCrumbs, setExtraCrumbs] = useState<BreadcrumbItemData[] | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ extraCrumbs, setExtraCrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
