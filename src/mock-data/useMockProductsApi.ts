import { useCallback } from 'react';
import { toys } from './toy-card-list.ts';
import {
  feedbacks,
  infoCards,
  photoShoots,
  topPicksRadioOptions,
  unifiedCategories,
} from './home-page.ts';
import { description } from './product-details-page.ts';
import type { CartItem } from '../types/product.types.ts';
import {
  brandsRadioOptions,
  colorsRadioOptions,
  DEFAULT_PRICE,
  materialsRadioOptions,
} from './shop-page.ts';

export const MOCK_API_DELAY_MS = 1000;

// Helper to add delay to any promise
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Mocked API to simulate categories fetching
export const getProductCategories = async () => {
  await delay(MOCK_API_DELAY_MS);
  return unifiedCategories;
};

// -----------------------------
// AUTH & CLOUD SYNC MOCK LOGIC
// -----------------------------

export const mockLoginApi = async (email: string, password: string) => {
  await delay(MOCK_API_DELAY_MS);
  if (email && password) return { email, token: 'mock-token' };
  throw new Error('Invalid credentials');
};

export const mockRegisterApi = async (email: string, password: string) => {
  await delay(MOCK_API_DELAY_MS);
  if (email && password) return { email, token: 'mock-token' };
  throw new Error('Registration failed');
};

export const mockFetchUserApi = async (token: string) => {
  await delay(MOCK_API_DELAY_MS);
  if (token === 'mock-token') {
    return { id: '1', name: 'Mock User', email: 'mockuser@example.com' };
  }
  throw new Error('Invalid token');
};

// -----------------------------
// CLOUD STORAGE MOCKS
// -----------------------------

export const mockSaveCartToCloud = async (cartItems: CartItem[]) => {
  localStorage.setItem('cloud-cart', JSON.stringify(cartItems));
};

export const mockLoadCartFromCloud = async (): Promise<CartItem[]> => {
  const data = localStorage.getItem('cloud-cart');
  return data ? JSON.parse(data) : [];
};

export const mockSaveFavoritesToCloud = async (favoriteIds: string[]) => {
  localStorage.setItem('cloud-favorites', JSON.stringify(favoriteIds));
};

export const mockLoadFavoritesFromCloud = async (): Promise<string[]> => {
  const data = localStorage.getItem('cloud-favorites');
  return data ? JSON.parse(data) : [];
};

// -----------------------------
// SHOP FILTER OPTIONS
// -----------------------------

export const getShopFilterOptions = async (token: string) => {
  await delay(MOCK_API_DELAY_MS);
  return {
    colors: colorsRadioOptions,
    brands: brandsRadioOptions,
    materials: materialsRadioOptions,
    priceRange: DEFAULT_PRICE,
  };
};

// -----------------------------
// PRODUCTS & HOME DATA (MOCKED)
// -----------------------------

export function useMockProductsApi<T extends { category?: string }>(pageSize?: number) {
  const fullItems = toys;

  function extractFilterOptions(field: keyof T): { value: string; label: string }[] {
    const values = Array.from(
      new Set(fullItems.map((item) => item[field] as string).filter(Boolean))
    );
    return values.map((value) => ({
      value,
      label: capitalize(value),
    }));
  }

  const fetchProducts = useCallback(
    async (
      page: number,
      filters = {}
    ): Promise<{
      items: T[];
      page: number;
      totalPages: number;
      totalItems: number;
    }> => {
      await delay(MOCK_API_DELAY_MS);

      let filteredItems = fullItems;

      // Filtering
      if (filters.category && filters.category !== 'all') {
        filteredItems = filteredItems.filter((item) => item.category === filters.category);
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        filteredItems = filteredItems.filter((item) =>
          [item.name, item.description, item.category].some((field) =>
            field?.toLowerCase().includes(term)
          )
        );
      }
      if (filters.priceMin !== undefined) {
        filteredItems = filteredItems.filter((item) => item.price >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        filteredItems = filteredItems.filter((item) => item.price <= filters.priceMax!);
      }
      if (filters.brand) {
        filteredItems = filteredItems.filter((item) => item.brand === filters.brand);
      }
      if (filters.material) {
        filteredItems = filteredItems.filter((item) => item.material === filters.material);
      }
      if (filters.color) {
        filteredItems = filteredItems.filter((item) => item.color === filters.color);
      }

      // Sorting
      filteredItems = sortItems(filteredItems, filters.sortBy);

      const totalItems = filteredItems.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const paginated = filteredItems.slice((page - 1) * pageSize, page * pageSize);
      return { items: paginated, page, totalPages, totalItems };
    },
    [pageSize]
  );

  // Simulate a real-world structure
  return {
    fetchProducts,
    fetchPage: fetchProducts,
    getProductById: useCallback(async (id: string) => {
      await delay(MOCK_API_DELAY_MS);
      return fullItems.find((item) => item.id === id);
    }, []),
    getRelatedProducts: useCallback(async (productId: string, limit: number = 4) => {
      await delay(MOCK_API_DELAY_MS);
      return fullItems.filter((item) => item.id !== productId).slice(0, limit);
    }, []),
    fetchProductReviews: useCallback(async (productId: string, page: number) => {
      await delay(MOCK_API_DELAY_MS);
      return { items: [], page, totalPages: 1, totalItems: 0 };
    }, []),
    getTestimonials: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return feedbacks;
    }, []),
    getHomepageContent: useCallback(async (currencySymbol?: string) => {
      await delay(MOCK_API_DELAY_MS);
      const dynamicCards = infoCards.map((card) =>
        card.title === 'Free Shipping' && currencySymbol
          ? { ...card, content: `Free shipping for 150${currencySymbol} and up` }
          : card
      );
      return {
        photoShoots,
        topPicksOptions: topPicksRadioOptions,
        infoCards: dynamicCards,
        banners: [
          'Discover the Joy of Play',
          'Flash sale 30%',
          'Extra discount for loyal customers',
        ],
      };
    }, []),
    getProductDescription: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return description;
    }, []),
    getCurrencySettings: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return { currency: 'USD', symbol: '$' };
    }, []),
    getShippingSettings: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return {
        cost: 0,
        freeThreshold: 150,
        message: 'Free shipping with over $150',
      };
    }, []),
    globalSearch: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return { products: [], suggestions: [], categories: [] };
    }, []),
    searchProducts: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return { products: [], suggestions: [], categories: [] };
    }, []),
    getBrands: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return extractFilterOptions('brand');
    }, []),
    getColors: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return extractFilterOptions('color');
    }, []),
    getMaterials: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return extractFilterOptions('material');
    }, []),
    getCategoriesOptions: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return extractFilterOptions('category');
    }, []),
    getFlashSale: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return {
        message: 'Limited time deals on select products.',
        endTime: new Date(Date.now() + 1000 * 60).toISOString(), // 2 hours from now
        title: 'Flash Sale!',
        icon: 'faBolt',
      };
    }, []),
  };
}

// -----------------------------
// Helpers
// -----------------------------
function sortItems<
  T extends { price: number; sales?: number; rating?: number; releaseDate?: string },
>(items: T[], sortBy?: string): T[] {
  switch (sortBy) {
    case 'best_seller':
      return [...items].sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0));
    case 'new_arrivals':
      return [...items].sort(
        (a, b) => new Date(b.releaseDate ?? '').getTime() - new Date(a.releaseDate ?? '').getTime()
      );
    case 'price_asc':
      return [...items].sort((a, b) => a.price - b.price);
    case 'price_desc':
      return [...items].sort((a, b) => b.price - a.price);
    case 'rating':
      return [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default:
      return [...items]; // featured or default
  }
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
