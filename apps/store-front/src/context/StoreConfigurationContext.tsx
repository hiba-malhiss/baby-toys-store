import { createContext, useContext, useEffect, useState, type ReactNode, useMemo } from 'react';
import { useMockProductsApi } from '@mock-data/useMockApi';
import type { Category, Brand, Color, Material } from '@baby-toys/types';
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
  categories: Category[];
  brands: Brand[];
  colors: Color[];
  materials: Material[];
  priceRange: [number, number];
  isLoadingConfigs: boolean;
  getCategoryName: (id: string) => string;
  getBrandName: (id: string) => string;
  getColorName: (id: string) => string;
  getMaterialName: (id: string) => string;
}

const StoreConfigurationContext = createContext<StoreConfiguration | undefined>(undefined);

export const StoreConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencySettings | null>(null);
  const [shipping, setShipping] = useState<ShippingSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [priceRange, setPriceRange] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    getCurrencySettings,
    getShippingSettings,
    getCategories,
    getBrands,
    getColors,
    getMaterials,
  } = useMockProductsApi(10);

  const getCategoryName = useMemo(
    () => (id: string) => {
      return categories.find((c) => c.id === id)?.name || id;
    },
    [categories]
  );

  const getBrandName = useMemo(
    () => (id: string) => {
      return brands.find((b) => b.id === id)?.name || id;
    },
    [brands]
  );

  const getColorName = useMemo(
    () => (id: string) => {
      return colors.find((c) => c.id === id)?.name || id;
    },
    [colors]
  );

  const getMaterialName = useMemo(
    () => (id: string) => {
      return materials.find((m) => m.id === id)?.name || id;
    },
    [materials]
  );

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          currencyData,
          shippingData,
          categoriesData,
          brandsData,
          colorsData,
          materialsData,
          priceRangeData,
        ] = await Promise.all([
          getCurrencySettings(),
          getShippingSettings(),
          getCategories(),
          getBrands(),
          getColors(),
          getMaterials(),
          getPriceRange(),
        ]);

        setCurrency(currencyData);
        setShipping(shippingData);
        setCategories(categoriesData);
        setBrands(brandsData);
        setColors(colorsData);
        setMaterials(materialsData);
        setPriceRange(priceRangeData);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [getCurrencySettings, getShippingSettings, getCategories, getBrands, getColors, getMaterials]);

  const value = useMemo(
    () => ({
      currency,
      shipping,
      categories,
      brands,
      colors,
      materials,
      isLoadingConfigs: loading,
      getCategoryName,
      getBrandName,
      getColorName,
      getMaterialName,
      priceRange,
    }),
    [
      currency,
      shipping,
      categories,
      brands,
      colors,
      materials,
      loading,
      getCategoryName,
      getBrandName,
      getColorName,
      getMaterialName,
      priceRange,
    ]
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
