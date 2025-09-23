import { useMemo } from 'react';
import type { RadioOption } from '@baby-toys/ui-kit';
import { useStoreConfiguration } from '../context/StoreConfigurationContext';

export function useShopFilterOptions() {
  const {
    colors: allColors,
    brands: allBrands,
    materials: allMaterials,
    priceRange,
    isLoadingConfigs,
  } = useStoreConfiguration();

  // Map the configuration data to RadioOption format
  const colors = useMemo<RadioOption[]>(
    () =>
      allColors.map((color) => ({
        label: color.name,
        value: color.code,
      })),
    [allColors]
  );

  const brands = useMemo<RadioOption[]>(
    () =>
      allBrands.map((brand) => ({
        label: brand.name,
        value: brand.id,
      })),
    [allBrands]
  );

  const materials = useMemo<RadioOption[]>(
    () =>
      allMaterials.map((material) => ({
        label: material.name,
        value: material.id,
      })),
    [allMaterials]
  );

  return {
    colors,
    brands,
    materials,
    loading: isLoadingConfigs,
    defaultPriceRange: priceRange,
  };
}
