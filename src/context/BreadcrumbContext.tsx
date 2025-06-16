import React, { createContext, useContext, useState } from 'react';

interface ExtraBreadcrumb {
  label: string;
}

interface BreadcrumbContextType {
  extraCrumb: ExtraBreadcrumb | null;
  setExtraCrumb: (crumb: ExtraBreadcrumb | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  extraCrumb: null,
  setExtraCrumb: () => {},
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [extraCrumb, setExtraCrumb] = useState<ExtraBreadcrumb | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ extraCrumb, setExtraCrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
