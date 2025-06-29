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
import { currency, shippingCost } from './shipping-page.ts';

// Pagination mode for API
// In a real API, this would be handled by query params
// e.g. /api/products?page=1&pageSize=8
// Here, 'show-more' simulates infinite scroll, 'default' simulates classic pagination
// This is easy to swap for a real API in the future
//
type PaginationMode = 'default' | 'show-more';

/**
 * BACKEND API DESIGN FOR BABY TOYS STORE
 *
 * This mock API simulates how the real backend should be structured.
 * The backend should be a RESTful API with the following endpoints:
 *
 * PRODUCTS API:
 * GET /api/products?page=1&limit=8&category=toys&sortBy=featured&search=teddy&priceMin=10&priceMax=100
 * GET /api/products/:id
 * GET /api/products/related/:id?limit=4
 *
 * REVIEWS API:
 * GET /api/products/:productId/reviews?page=1&limit=10
 * POST /api/products/:productId/reviews
 *
 * TESTIMONIALS API:
 * GET /api/testimonials?limit=5
 *
 * CATEGORIES API:
 * GET /api/categories
 *
 * CONTENT API:
 * GET /api/content/homepage
 * GET /api/content/policies
 * GET /api/content/product-description/:id
 *
 * SETTINGS API:
 * GET /api/settings/currency
 * GET /api/settings/shipping
 *
 * SEARCH API:
 * GET /api/search?q=teddy&limit=10
 *
 * Foreign keys:
 * - Product.brand, Product.material, Product.color, Product.category should match values in filter option endpoints
 * - Product.id is used as a foreign key in reviews, favorites, cart, etc.
 */

export function useMockProductsApi<T extends { category?: string }>(
  pageSize: number,
  mode: PaginationMode = 'default'
) {
  const fullItems = toys;
  const allTestimonials = feedbacks;

  // Centralized filter option extraction utility
  // In a real API, these would be separate endpoints (e.g. /api/colors)
  function extractFilterOptions(field: keyof T): { value: string; label: string }[] {
    const values = Array.from(
      new Set(fullItems.map((item) => item[field] as string).filter(Boolean))
    );
    // In a real API, label could be localized or more descriptive
    return values.map((value) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    }));
  }

  // PRODUCTS API
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

          // Filtering logic (matches real API query params)
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

          // Sorting logic (matches real API query params)
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
          if (mode === 'show-more') {
            paginated = filteredItems.slice(0, page * pageSize);
          } else {
            const startIdx = (page - 1) * pageSize;
            paginated = filteredItems.slice(startIdx, startIdx + pageSize);
          }

          resolve({
            items: paginated,
            page,
            totalPages,
            totalItems,
          });
        }, 500);
      });
    },
    [pageSize, mode]
  );

  // Filter option endpoints (easy to swap for real API)
  const getBrands = useCallback(() => Promise.resolve(extractFilterOptions('brand')), []);
  const getColors = useCallback(() => Promise.resolve(extractFilterOptions('color')), []);
  const getMaterials = useCallback(() => Promise.resolve(extractFilterOptions('material')), []);
  const getCategoriesOptions = useCallback(
    () => Promise.resolve(extractFilterOptions('category')),
    []
  );

  // The rest of the API (reviews, testimonials, categories, homepage, etc.) remains unchanged
  // ...

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
    getTestimonials: useCallback((limit: number = 5) => Promise.resolve([]), []),
    getCategories: useCallback(() => Promise.resolve(toyCategories), []),
    getHomepageContent: useCallback(
      () => Promise.resolve({ photoShoots, topPicksOptions: topPicksRadioOptions, infoCards }),
      []
    ),
    getShopCategories: useCallback(() => Promise.resolve(categoriesRadioOptions), []),
    getProductDescription: useCallback((productId: string) => Promise.resolve(description), []),
    getCurrencySettings: useCallback(() => Promise.resolve(currency), []),
    getShippingSettings: useCallback(() => Promise.resolve(shippingCost), []),
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
    // Centralized filter option endpoints
    getBrands,
    getColors,
    getMaterials,
    getCategoriesOptions,
  };
}

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
