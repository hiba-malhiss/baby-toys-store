import { useCallback } from 'react';
import { toys } from './toy-card-list.ts';
import {
  feedbacks,
  toyCategories,
  infoCards,
  photoShoots,
  topPicksRadioOptions,
} from './home-page.ts';
import { categoriesRadioOptions } from './shop-page.ts';
import { description } from './product-details-page.ts';
import type { CartItem } from '../types/product.types.ts';

// --- AUTH & CLOUD MOCK API ---
export const mockLoginApi = async (email: string, password: string) => {
  await new Promise((res) => setTimeout(res, 500));
  if (email && password) return { email, token: 'mock-token' };
  throw new Error('Invalid credentials');
};

export const mockRegisterApi = async (email: string, password: string) => {
  await new Promise((res) => setTimeout(res, 500));
  if (email && password) return { email, token: 'mock-token' };
  throw new Error('Registration failed');
};

export const mockCheckTokenApi = async (token: string) => {
  await new Promise((res) => setTimeout(res, 300));
  // Simulate token expiry: only 'mock-token' is valid
  if (token === 'mock-token') return { valid: true };
  return { valid: false };
};

export const mockSaveCartToCloud = async (cartItems: CartItem[]) => {
  localStorage.setItem('cloud-cart', JSON.stringify(cartItems));
};
export const mockLoadCartFromCloud = async (): Promise<CartItem[]> => {
  const data = localStorage.getItem('cloud-cart');
  return data ? JSON.parse(data) : [];
};
export const mockClearCartCloud = async () => {
  localStorage.removeItem('cloud-cart');
};

export const mockSaveFavoritesToCloud = async (favoriteIds: string[]) => {
  localStorage.setItem('cloud-favorites', JSON.stringify(favoriteIds));
};
export const mockLoadFavoritesFromCloud = async (): Promise<string[]> => {
  const data = localStorage.getItem('cloud-favorites');
  return data ? JSON.parse(data) : [];
};
export const mockClearFavoritesCloud = async () => {
  localStorage.removeItem('cloud-favorites');
};

export function useMockProductsApi<T extends { category?: string }>(pageSize: number) {
  const fullItems = toys;

  function extractFilterOptions(field: keyof T): { value: string; label: string }[] {
    const values = Array.from(
      new Set(fullItems.map((item) => item[field] as string).filter(Boolean))
    );
    return values.map((value) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    }));
  }

  const fetchProducts = useCallback(
    (
      page: number,
      filters?: {
        category?: string;
        sortBy?: string;
        search?: string;
        priceMin?: number;
        priceMax?: number;
        brand?: string;
        color?: string;
        material?: string;
      }
    ): Promise<{
      items: T[];
      page: number;
      totalPages: number;
      totalItems: number;
    }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredItems = fullItems;
          if (filters?.category && filters.category !== 'all') {
            filteredItems = filteredItems.filter((item) => item.category === filters.category);
          }
          if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredItems = filteredItems.filter(
              (item) =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.description?.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            );
          }
          if (filters?.priceMin !== undefined) {
            filteredItems = filteredItems.filter((item) => item.price >= filters.priceMin!);
          }
          if (filters?.priceMax !== undefined) {
            filteredItems = filteredItems.filter((item) => item.price <= filters.priceMax!);
          }
          if (filters?.brand) {
            filteredItems = filteredItems.filter((item) => item.brand === filters.brand);
          }
          if (filters?.material) {
            filteredItems = filteredItems.filter((item) => item.material === filters.material);
          }
          if (filters?.color) {
            filteredItems = filteredItems.filter((item) => item.color === filters.color);
          }
          if (filters?.sortBy === 'featured') {
            filteredItems = [...filteredItems];
          } else if (filters?.sortBy === 'best_seller') {
            filteredItems = [...filteredItems].sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0));
          } else if (filters?.sortBy === 'new_arrivals') {
            filteredItems = [...filteredItems].sort(
              (a, b) =>
                new Date(b.releaseDate ?? '').getTime() - new Date(a.releaseDate ?? '').getTime()
            );
          } else if (filters?.sortBy === 'price_asc') {
            filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
          } else if (filters?.sortBy === 'price_desc') {
            filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
          } else if (filters?.sortBy === 'rating') {
            filteredItems = [...filteredItems].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
          }
          const totalItems = filteredItems.length;
          const totalPages = Math.ceil(totalItems / pageSize);
          let paginated: T[];

          const startIdx = (page - 1) * pageSize;
          paginated = filteredItems.slice(startIdx, startIdx + pageSize);

          resolve({
            items: paginated,
            page,
            totalPages,
            totalItems,
          });
        }, 500);
      });
    },
    [pageSize]
  );

  const getBrands = useCallback(() => Promise.resolve(extractFilterOptions('brand')), []);
  const getColors = useCallback(() => Promise.resolve(extractFilterOptions('color')), []);
  const getMaterials = useCallback(() => Promise.resolve(extractFilterOptions('material')), []);
  const getCategoriesOptions = useCallback(
    () => Promise.resolve(extractFilterOptions('category')),
    []
  );

  return {
    fetchProducts,
    fetchPage: fetchProducts,
    getProductById: useCallback(
      (id: string) => Promise.resolve(fullItems.find((item) => item.id === id)),
      []
    ),
    getRelatedProducts: useCallback(
      (productId: string, limit: number = 4) =>
        Promise.resolve(fullItems.filter((item) => item.id !== productId).slice(0, limit)),
      []
    ),
    fetchProductReviews: useCallback(
      (productId: string, page: number) =>
        Promise.resolve({ items: [], page, totalPages: 1, totalItems: 0 }),
      []
    ),
    getTestimonials: useCallback((limit: number = 5) => Promise.resolve(feedbacks), []),
    getCategories: useCallback(() => Promise.resolve(toyCategories), []),
    getHomepageContent: useCallback((currencySymbol?: string) => {
      const dynamicInfoCards = infoCards.map((card) =>
        card.title === 'Free Shipping' && currencySymbol
          ? { ...card, content: `Free shipping for 150${currencySymbol} and up` }
          : card
      );
      return Promise.resolve({
        photoShoots,
        topPicksOptions: topPicksRadioOptions,
        infoCards: dynamicInfoCards,
      });
    }, []),
    getShopCategories: useCallback(() => Promise.resolve(categoriesRadioOptions), []),
    getProductDescription: useCallback((productId: string) => Promise.resolve(description), []),
    getCurrencySettings: useCallback(() => Promise.resolve({ currency: 'USD', symbol: '$' }), []),
    getShippingSettings: useCallback(() => Promise.resolve({ cost: 0, freeThreshold: 0 }), []),
    globalSearch: useCallback(
      (query: string, limit: number = 10) =>
        Promise.resolve({ products: [], suggestions: [], categories: [] }),
      []
    ),
    searchProducts: useCallback(
      (query: string, limit: number = 10) =>
        Promise.resolve({ products: [], suggestions: [], categories: [] }),
      []
    ),
    getBrands,
    getColors,
    getMaterials,
    getCategoriesOptions,
  };
}
