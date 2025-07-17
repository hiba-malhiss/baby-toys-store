import { useState, useEffect } from 'react';
import { getShopFilterOptions } from '@mock-data/useMockApi';
import type { RadioOption } from '@baby-toys/ui-kit/components';

export function useShopFilterOptions() {
  const [colors, setColors] = useState<RadioOption[]>([]);
  const [brands, setBrands] = useState<RadioOption[]>([]);
  const [materials, setMaterials] = useState<RadioOption[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>();
  const [defaultPriceRange, setDefaultPriceRange] = useState<[number, number]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const { colors, brands, materials, priceRange } = await getShopFilterOptions();
      setColors(colors);
      setBrands(brands);
      setMaterials(materials);
      setPriceRange(priceRange);
      setDefaultPriceRange(priceRange);
      setLoading(false);
    };
    fetchFilterOptions();
  }, []);

  return {
    colors,
    brands,
    materials,
    priceRange,
    loading,
    defaultPriceRange: defaultPriceRange || [1, 1000],
  };
}
