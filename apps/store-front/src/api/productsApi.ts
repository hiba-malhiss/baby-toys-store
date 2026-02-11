import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { ShopFilters } from '../pages/ShopPage/SideFilters/side-filters.utils';
import type { Product } from './types/product.ts';
import { parseAttributeFilters } from '../utils/filters.utils.ts';

export type ProductsQuery = {
  page: number;
  size: number;
  sortBy?: string;
  filters?: ShopFilters;
};

function mapSort(sortKey: string | undefined): { sortBy: string; sortDirection: 'ASC' | 'DESC' } {
  switch (sortKey) {
    case 'price_asc':
      // TODO: backend variant-price sorting not yet supported; fallback to createdAt asc
      return { sortBy: 'price', sortDirection: 'ASC' };
    case 'price_desc':
      // TODO: backend variant-price sorting not yet supported; fallback to createdAt desc
      return { sortBy: 'price', sortDirection: 'DESC' };
    case 'name':
      return { sortBy: 'name', sortDirection: 'ASC' };
    case 'rating':
      return { sortBy: 'rating', sortDirection: 'DESC' };
    case 'sales':
      return { sortBy: 'sales', sortDirection: 'DESC' };
    case 'createdAt':
      return { sortBy: 'createdAt', sortDirection: 'DESC' };
    case 'releaseDate':
      return { sortBy: 'releaseDate', sortDirection: 'DESC' };
    case 'numberOfRatings':
      return { sortBy: 'numberOfRatings', sortDirection: 'DESC' };
    default:
      return { sortBy: 'rating', sortDirection: 'DESC' };
  }
}

export function useProductsQuery({ page, size, sortBy, filters }: ProductsQuery) {
  const { sortBy: sb, sortDirection } = mapSort(sortBy);

  const categoryId = filters?.categoryId ? Number(filters.categoryId) : undefined;
  const minPrice = filters?.priceRange?.[0];
  const maxPrice = filters?.priceRange?.[1];
  const query = (filters as any)?.query;
  const onSale = (filters as any)?.discounts === 'discounts' ? true : undefined;
  const { attrsParam, attrsSignature } = parseAttributeFilters(filters);

  const zeroBasedPage = Math.max(0, (page || 1) - 1);

  return useQuery({
    queryKey: [
      'products',
      zeroBasedPage,
      size,
      sb,
      sortDirection,
      categoryId,
      minPrice,
      maxPrice,
      query || '',
      onSale ? 'onSale' : '',
      attrsSignature,
    ],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Page<Product>>>('/api/products', {
        params: {
          page: zeroBasedPage,
          size,
          sortBy: sb,
          sortDirection,
          categoryId,
          minPrice,
          maxPrice,
          query,
          onSale,
          ...attrsParam,
        },
      });
      const data = res.data.data;
      return {
        items: data?.content || [],
        page: (data?.number ?? zeroBasedPage) + 1,
        totalPages: data?.totalPages ?? 0,
        totalItems: data?.totalElements ?? 0,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
