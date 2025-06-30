import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type UrlFilters = {
  category?: string;
  sortBy?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  brand?: string;
  page?: number;
};

const paramParsers: Record<keyof UrlFilters, (val: string) => any> = {
  category: (v) => v,
  sortBy: (v) => v,
  search: (v) => v,
  priceMin: (v) => parseFloat(v),
  priceMax: (v) => parseFloat(v),
  brand: (v) => v,
  page: (v) => parseInt(v, 10),
};

function filtersToSearchParams(filters: Partial<UrlFilters>): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value.toString());
    }
  });
  return params;
}

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters = useMemo((): UrlFilters => {
    const result: UrlFilters = {};
    Object.entries(paramParsers).forEach(([key, parser]) => {
      const val = searchParams.get(key);
      if (val !== null) {
        result[key as keyof UrlFilters] = parser(val);
      }
    });
    return result;
  }, [searchParams]);

  const updateUrlFilters = useCallback(
    (newFilters: Partial<UrlFilters>) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            params.delete(key);
          } else {
            params.set(key, value.toString());
          }
        });
        // Reset page if filters other than page change
        if (!('page' in newFilters)) {
          params.delete('page');
        }
        return params;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const navigateToShop = useCallback((filters: UrlFilters) => {
    const params = filtersToSearchParams(filters);
    return '/shop?' + params.toString();
  }, []);

  return {
    urlFilters,
    updateUrlFilters,
    clearFilters,
    navigateToShop,
  };
}
