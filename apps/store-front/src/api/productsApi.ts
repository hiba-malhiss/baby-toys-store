import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import {
  parseAttributeFilters,
  parseOptionFilters,
  type ShopFilters,
} from '../pages/ShopPage/SideFilters/side-filters.utils';
import type { Product } from './types/product.ts';

export type ProductsQuery = {
  page: number;
  size: number;
  sortBy?: string;
  filters?: ShopFilters;
};

function mapSort(sortKey: string | undefined): { sortBy: string; sortDirection: 'ASC' | 'DESC' } {
  switch (sortKey) {
    case 'price_asc':
      return { sortBy: 'price', sortDirection: 'ASC' };
    case 'price_desc':
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

  const categoryIds = filters?.categoryIds?.map(Number).filter((v) => !isNaN(v));
  const minPrice = filters?.priceRange?.[0];
  const maxPrice = filters?.priceRange?.[1];
  const query = (filters as any)?.query;
  const onSale = (filters as any)?.discounts === 'discounts' ? true : undefined;
  const { attrsBody, attrsSignature } = parseAttributeFilters(filters);
  const inStock = (filters as any)?.inStock === 'inStock' ? true : undefined;
  const { optsBody, optsSignature } = parseOptionFilters(filters);

  const zeroBasedPage = Math.max(0, (page || 1) - 1);

  return useQuery({
    queryKey: [
      'products',
      zeroBasedPage,
      size,
      sb,
      sortDirection,
      ...(categoryIds || []),
      minPrice,
      maxPrice,
      query || '',
      onSale ? 'onSale' : '',
      attrsSignature,
      optsSignature,
      inStock ? 'inStock' : '',
    ],
    queryFn: async () => {
      const res = await api.post<ApiEnvelope<Page<Product>>>('/api/products', {
        page: zeroBasedPage,
        size,
        sortBy: sb,
        sortDirection,
        categoryIds,
        minPrice,
        maxPrice,
        query,
        onSale,
        inStock,
        attributeFilters: attrsBody,
        optionFilters: optsBody,
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
