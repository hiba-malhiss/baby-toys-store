import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import { useMockProductsApi, mockCheckTokenApi } from '../mock-data/useMockProductsApi.ts';

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
  loading: boolean;
  isLoggedIn: boolean;
}

const StoreConfigurationContext = createContext<StoreConfiguration | undefined>(undefined);

export const StoreConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencySettings | null>(null);
  const [shipping, setShipping] = useState<ShippingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { getCurrencySettings, getShippingSettings } = useMockProductsApi(10);

  // Auth logic
  const checkToken = useCallback(async () => {
    const token = localStorage.getItem('mock-token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    const result = await mockCheckTokenApi(token);
    setIsLoggedIn(result.valid);
    if (!result.valid) localStorage.removeItem('mock-token');
  }, []);

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
    checkToken();
  }, [getCurrencySettings, getShippingSettings, checkToken]);

  return (
    <StoreConfigurationContext.Provider value={{ currency, shipping, loading, isLoggedIn }}>
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
