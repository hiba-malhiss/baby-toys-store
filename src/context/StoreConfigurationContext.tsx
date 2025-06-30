import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useMockProductsApi } from '../mock-data/useMockProductsApi.ts';

export interface CurrencySettings {
  currency: string;
  symbol: string;
}

export interface ShippingSettings {
  cost: number;
  freeThreshold: number;
}

export interface StoreConfiguration {
  currency: CurrencySettings | null;
  shipping: ShippingSettings | null;
  isLoadingConfigs: boolean;
}

const StoreConfigurationContext = createContext<StoreConfiguration | undefined>(undefined);

export const StoreConfigurationProvider = ({ children }: { children: ReactNode }) => {
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
    <StoreConfigurationContext.Provider value={{ currency, shipping, isLoadingConfigs: loading }}>
      {children}
    </StoreConfigurationContext.Provider>
  );
};

export const useStoreConfiguration = () => {
  const context = useContext(StoreConfigurationContext);
  if (context === undefined) {
    throw new Error('useStoreConfiguration must be used within a StoreConfigurationProvider');
  }
  return context;
};
