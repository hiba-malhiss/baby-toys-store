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

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current URL params into filters object
  const filters = useMemo((): UrlFilters => {
    const params: UrlFilters = {};
    
    const category = searchParams.get('category');
    if (category) params.category = category;
    
    const sortBy = searchParams.get('sortBy');
    if (sortBy) params.sortBy = sortBy;
    
    const search = searchParams.get('search');
    if (search) params.search = search;
    
    const priceMin = searchParams.get('priceMin');
    if (priceMin) params.priceMin = parseFloat(priceMin);
    
    const priceMax = searchParams.get('priceMax');
    if (priceMax) params.priceMax = parseFloat(priceMax);
    
    const brand = searchParams.get('brand');
    if (brand) params.brand = brand;
    
    const page = searchParams.get('page');
    if (page) params.page = parseInt(page, 10);
    
    return params;
  }, [searchParams]);

  // Update URL with new filters
  const updateFilters = useCallback((newFilters: Partial<UrlFilters>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      
      // Update or remove each filter
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });
      
      // Reset page when filters change (except when explicitly setting page)
      if (!('page' in newFilters)) {
        params.delete('page');
      }
      
      return params;
    });
  }, [setSearchParams]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // Navigate to shop page with specific filters
  const navigateToShop = useCallback((filters: UrlFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });
    
    // This would be used with navigate('/shop?' + params.toString())
    return '/shop?' + params.toString();
  }, []);

  return {
    filters,
    updateFilters,
    clearFilters,
    navigateToShop,
  };
}