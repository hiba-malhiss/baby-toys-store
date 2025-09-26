import { createContext, useContext, useEffect, useState, type ReactNode, useMemo } from 'react';
import { useMockProductsApi } from '@mock-data/useMockApi';
import { getPriceRange } from '../../../../mock-data/useMockApi.ts';

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
  priceRange: [number, number];
  isLoadingConfigs: boolean;
}

const StoreConfigurationContext = createContext<StoreConfiguration | undefined>(undefined);

export const StoreConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencySettings | null>(null);
  const [shipping, setShipping] = useState<ShippingSettings | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 300]);
  const [loading, setLoading] = useState(true);

  const { getCurrencySettings, getShippingSettings } = useMockProductsApi(10);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [currencyData, shippingData, priceRangeData] = await Promise.all([
          getCurrencySettings(),
          getShippingSettings(),
          getPriceRange(),
        ]);

        setCurrency(currencyData);
        setShipping(shippingData);
        setPriceRange(priceRangeData);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [getCurrencySettings, getShippingSettings]);

  const value = useMemo(
    () => ({
      currency,
      shipping,
      isLoadingConfigs: loading,
      priceRange,
    }),
    [currency, shipping, loading, priceRange]
  );

  return (
    <StoreConfigurationContext.Provider value={value}>
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
