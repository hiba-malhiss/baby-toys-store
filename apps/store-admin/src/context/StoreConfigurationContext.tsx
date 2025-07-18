import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import { useMockProductsApi, useMockAdminApi } from '@mock-data/useMockApi';
import type { Brand, Color, Material, Category } from '@baby-toys/types';

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
  colors: Color[];
  brands: Brand[];
  materials: Material[];
  categories: Category[];
  isLoadingConfigs: boolean;
  refreshProductReferences: () => Promise<void>;
}

const AdminStoreConfigurationContext = createContext<StoreConfiguration | undefined>(undefined);

export const AdminStoreConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencySettings | null>(null);
  const [shipping, setShipping] = useState<ShippingSettings | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { getCurrencySettings, getShippingSettings } = useMockProductsApi(10);
  const { getColors, getBrands, getMaterials, getCategories } = useMockAdminApi();

  const fetchReferences = useCallback(async () => {
    try {
      const [colorsData, brandsData, materialsData, categoriesData] = await Promise.all([
        getColors(),
        getBrands(),
        getMaterials(),
        getCategories(),
      ]);

      setColors(colorsData);
      setBrands(brandsData);
      setMaterials(materialsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching references:', error);
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          getCurrencySettings().then(setCurrency),
          getShippingSettings().then(setShipping),
          fetchReferences(),
        ]);
      } catch (error) {
        console.error('Error loading store configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [getCurrencySettings, getShippingSettings, fetchReferences]);

  const refreshProductReferences = useCallback(async () => {
    await fetchReferences();
  }, [fetchReferences]);

  return (
    <AdminStoreConfigurationContext.Provider
      value={{
        currency,
        shipping,
        colors,
        brands,
        materials,
        categories,
        isLoadingConfigs: loading,
        refreshProductReferences,
      }}
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
