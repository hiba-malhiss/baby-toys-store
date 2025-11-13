import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from './axiosConfig';
import type { ApiEnvelope, Page } from './types/common';
import type { ShopFilters } from '../pages/ShopPage/SideFilters/side-filters.utils';
import type { Product } from './types/product.ts';
import { normalizeProduct } from './normalizers/productNormalizer';

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

  const categoryId = filters?.categoryId ? Number(filters.categoryId) : undefined;
  const brandId = filters?.brandId ? Number(filters.brandId) : undefined;
  const colorIds = filters?.colorId ? [Number(filters.colorId)] : undefined;
  const materialIds = filters?.materialId ? [Number(filters.materialId)] : undefined;
  const minPrice = filters?.priceRange?.[0];
  const maxPrice = filters?.priceRange?.[1];
  const query = (filters as any)?.query;
  const onSale = (filters as any)?.discounts === 'discounts' ? true : undefined;

  const zeroBasedPage = Math.max(0, (page || 1) - 1);

  return useQuery({
    queryKey: [
      'products',
      zeroBasedPage,
      size,
      sb,
      sortDirection,
      categoryId,
      brandId,
      (colorIds || []).join(','),
      (materialIds || []).join(','),
      minPrice,
      maxPrice,
      query || '',
      onSale ? 'onSale' : '',
    ],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<Page<Product>>>('/api/products', {
        params: {
          page: zeroBasedPage,
          size,
          sortBy: sb,
          sortDirection,
          categoryId,
          brandId,
          minPrice,
          maxPrice,
          colorIds,
          materialIds,
          query,
          onSale,
        },
      });
      const data = res.data.data;
      return {
        items: (data?.content || []).map((dto: Product) => normalizeProduct(dto)),
        page: (data?.number ?? zeroBasedPage) + 1,
        totalPages: data?.totalPages ?? 0,
        totalItems: data?.totalElements ?? 0,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
