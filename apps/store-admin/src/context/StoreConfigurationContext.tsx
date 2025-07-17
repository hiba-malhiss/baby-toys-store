import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useMockProductsApi } from '@mock-data/useMockApi';

export interface CurrencySettings {
  currency: string;
  symbol: string;
}

export interface ShippingSettings {
  cost: number;
  freeThreshold: number;
  headerMessage: string;
}

export interface StoreConfiguration {
  currency: CurrencySettings | null;
  shipping: ShippingSettings | null;
  isLoadingConfigs: boolean;
}

const AdminStoreConfigurationContext = createContext<StoreConfiguration | undefined>(undefined);

export const AdminStoreConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencySettings | null>(null);
  const [shipping, setShipping] = useState<ShippingSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const { getCurrencySettings, getShippingSettings } = useMockProductsApi(10);

  useEffect(() => {
    Promise.all([getCurrencySettings(), getShippingSettings()])
      .then(([currencyData, shippingData]) => {
        setCurrency(currencyData);
        setShipping(shippingData);
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getCurrencySettings, getShippingSettings]);

  return (
    <AdminStoreConfigurationContext.Provider
      value={{ currency, shipping, isLoadingConfigs: loading }}
    >
      {children}
    </AdminStoreConfigurationContext.Provider>
  );
};

export const useAdminStoreConfiguration = () => {
  const context = useContext(AdminStoreConfigurationContext);
  if (context === undefined) {
    throw new Error('useStoreConfiguration must be used within a StoreConfigurationProvider');
  }
  return context;
};
