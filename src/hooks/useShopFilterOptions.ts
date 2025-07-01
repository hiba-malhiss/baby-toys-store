import { useState, useEffect } from 'react';
import { getShopFilterOptions } from '../mock-data/useMockProductsApi';
import type { RadioOption } from '../components/common/RadioButtonGroup/RadioButtonGroup';

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

  return { colors, brands, materials, priceRange, loading, defaultPriceRange };
}
