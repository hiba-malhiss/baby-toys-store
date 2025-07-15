import { useCallback } from 'react';
import { toys } from './toy-card-list.ts';
import { reviews, infoCards, photoShoots, unifiedCategories } from './home-page.ts';
import { description } from './product-details-page.ts';
import type { CartItem, Review, OrderItem, CartItemBE, Product } from '../types/product.types.ts';
import {
  brandsRadioOptions,
  colorsRadioOptions,
  DEFAULT_PRICE,
  materialsRadioOptions,
} from './shop-page.ts';

export const MOCK_API_DELAY_MS = 600;

// Helper to add delay to any promise
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Mocked API to simulate categories fetching
export const getProductCategories = async () => {
  await delay(MOCK_API_DELAY_MS);
  return unifiedCategories;
};

// -----------------------------
// STOCK MANAGEMENT MOCK LOGIC
// -----------------------------

export const mockFetchProductAvailability = async (productId: string) => {
  await delay(MOCK_API_DELAY_MS / 2); // Faster check
  const product = toys.find((p) => p.id === productId);
  if (!product) {
    return { availableStock: 0 };
  }
  return { availableStock: product.availableInStock };
};

// -----------------------------
// AUTH & CLOUD SYNC MOCK LOGIC
// -----------------------------

export const mockLoginApi = async (email: string, password: string) => {
  await delay(MOCK_API_DELAY_MS);
  // Demo credentials: user@example.com / password123
  if ((email === 'user@example.com' && password === 'password123') || (email && password)) {
    return { email, token: 'mock-token' };
  }
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
    return { id: '1', name: 'Mock User', email: 'user@example.com' };
  }
  throw new Error('Invalid token');
};

import type { ProductWithFavorite } from '../types/product.types';
// -----------------------------
// CLOUD STORAGE MOCKS
// -----------------------------

import type { OrderPayload } from '../types/product.types.ts';

export const mockPlaceOrder = async (order: OrderPayload) => {
  await delay(MOCK_API_DELAY_MS);

  // Server-side stock check
  for (const item of order.cartItems) {
    const product = toys.find((p) => p.id === item.productId);
    if (!product || product.availableInStock < item.quantity) {
      throw new Error(`Not enough stock for product: ${item.product?.name ?? 'unknown'}`);
    }
  }

  // Decrease stock
  for (const item of order.cartItems) {
    const product = toys.find((p) => p.id === item.productId);
    if (product) {
      product.availableInStock -= item.quantity;
    }
  }

  const orders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');

  // Calculate subtotal from cart items
  const subtotal = order.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Determine user identifier
  const token = localStorage.getItem('auth_token');
  let userIdentifier: string | undefined;

  if (token === 'mock-token') {
    userIdentifier = 'user@example.com';
  } else if (order.shippingInfo?.phone) {
    userIdentifier = order.shippingInfo.phone;
  } else {
    throw new Error('Missing user identifier (phone or email) for order');
  }

  // Save shipping info
  if (order.shippingInfo && userIdentifier) {
    await mockSaveShippingInfo(userIdentifier, order.shippingInfo);
  }

  const newOrder: OrderItem = {
    id: Date.now(),
    email: userIdentifier, // Now either email or phone
    date: new Date().toISOString(),
    cartItems: order.cartItems,
    subtotal,
    shippingCost: order.shippingCost || 0,
    total: order.total,
    shippingInfo: order.shippingInfo,
  };

  orders.push(newOrder);
  localStorage.setItem('mock-orders', JSON.stringify(orders));

  // Clear cart
  localStorage.setItem('cloud-cart', '[]');
};

export const mockFetchOrdersHistory = async (
  userEmail: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{
  items: OrderItem[];
  page: number;
  totalPages: number;
  totalItems: number;
}> => {
  await delay(MOCK_API_DELAY_MS);

  const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]').filter(
    (o: OrderItem) => o.email === userEmail
  );

  for (const order of allOrders) {
    const productIds = order.cartItems.map((item) => item.productId);
    const products = await Promise.all(productIds.map((id) => toys.find((p) => p.id === id)));
    const reviews = JSON.parse(localStorage.getItem('mock-product-reviews') || '[]');
    order.cartItems = order.cartItems.map((item, index) => ({
      ...item,
      product: products[index],
      isReviewed: reviews.some(
        (r: any) => r.orderId === order.id && r.productId === item.productId
      ),
    }));
  }

  // Sort orders by date (newest first)
  allOrders.sort(
    (a: OrderItem, b: OrderItem) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalItems = allOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp page within valid bounds
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const items = allOrders.slice(startIndex, endIndex);

  return {
    items,
    page: currentPage,
    totalPages,
    totalItems,
  };
};

export const mockFetchWishlist = async (
  page: number,
  pageSize: number
): Promise<{
  items: ProductWithFavorite[];
  page: number;
  totalPages: number;
  totalItems: number;
}> => {
  await delay(MOCK_API_DELAY_MS);
  const data = localStorage.getItem('cloud-favorites');
  const favIds: string[] = data ? JSON.parse(data) : [];
  const allProducts = toys.filter((p) => favIds.includes(p.id));
  const totalItems = allProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginated = allProducts.slice((page - 1) * pageSize, page * pageSize);
  return {
    items: paginated.map((p) => ({ ...p, isUserFavorite: true })),
    page,
    totalPages,
    totalItems,
  };
};

export const mockSaveCartToCloud = async (cartItems: CartItemBE[]) => {
  const cartItemsBE: CartItemBE[] = cartItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
  localStorage.setItem('cloud-cart', JSON.stringify(cartItemsBE));
};

export const mockLoadCartFromCloud = async (): Promise<CartItem[]> => {
  const data = localStorage.getItem('cloud-cart');
  const cartItemsBE: CartItemBE[] = data ? JSON.parse(data) : [];

  if (cartItemsBE.length === 0) {
    return [];
  }

  const productIds = cartItemsBE.map((item) => item.productId);
  const products = await Promise.all(productIds.map((id) => toys.find((p) => p.id === id)));

  return cartItemsBE.map((item, index) => ({
    ...item,
    id: `cart-${item.productId}`,
    dateAdded: Date.now(),
    product: products[index],
  }));
};

function triggerWishlistChange() {
  localStorage.setItem('cloud-favorites-timestamp', Date.now().toString());
}

export const mockAddToWishlist = async (productId: string) => {
  const data = localStorage.getItem('cloud-favorites');
  const favs: string[] = data ? JSON.parse(data) : [];

  if (!favs.includes(productId)) {
    favs.push(productId);
    localStorage.setItem('cloud-favorites', JSON.stringify(favs));
    triggerWishlistChange();
  }
};

export const mockRemoveFromWishlist = async (productId: string) => {
  const data = localStorage.getItem('cloud-favorites');
  const favs: string[] = data ? JSON.parse(data) : [];

  const newFavs = favs.filter((id) => id !== productId);
  localStorage.setItem('cloud-favorites', JSON.stringify(newFavs));
  triggerWishlistChange();
};

export const mockLoadFavoritesFromCloud = async (): Promise<ProductWithFavorite[]> => {
  const data = localStorage.getItem('cloud-favorites');
  const favIds: string[] = data ? JSON.parse(data) : [];

  return toys.filter((p) => favIds.includes(p.id)).map((p) => ({ ...p, isUserFavorite: true }));
};

// -----------------------------
// SHOP FILTER OPTIONS
// -----------------------------

export const getShopFilterOptions = async () => {
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

export function useMockProductsApi(pageSize?: number) {
  const fullItems = toys;

  function extractFilterOptions(field: keyof Product): { value: string; label: string }[] {
    const values = Array.from(
      new Set(fullItems.flatMap((item) => item[field] as string[]).filter(Boolean))
    );
    return values.map((value) => ({
      value,
      label: capitalize(value),
    }));
  }

  const fetchProducts = useCallback(
    async (
      page: number,
      filters: Record<string, any> = {}
    ): Promise<{
      items: ProductWithFavorite[];
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
        filteredItems = filteredItems.filter((item) =>
          (item.material as string[]).includes(filters.material)
        );
      }
      if (filters.color) {
        filteredItems = filteredItems.filter((item) => (item.color as string[]).includes(filters.color));
      }

      // Sorting
      filteredItems = sortItems(filteredItems, filters.sortBy);

      // Add isUserFavorite to each product
      const favIdsData = localStorage.getItem('cloud-favorites');
      const favIds: string[] = favIdsData ? JSON.parse(favIdsData) : [];
      const withFavorite = filteredItems.map((item) => ({
        ...item,
        isUserFavorite: favIds.includes(item.id),
      }));

      const totalItems = withFavorite.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const paginated: ProductWithFavorite[] = withFavorite.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
      return { items: paginated, page, totalPages, totalItems };
    },
    [pageSize]
  );

  // Simulate a real-world structure
  return {
    refetchProduct: useCallback(async (productId: string) => {
      await delay(MOCK_API_DELAY_MS);
      const product = toys.find((p) => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      const favIdsData = localStorage.getItem('cloud-favorites');
      const favIds: string[] = favIdsData ? JSON.parse(favIdsData) : [];
      return {
        ...product,
        isUserFavorite: favIds.includes(product.id),
      };
    }, []),
    fetchProducts,
    fetchPage: fetchProducts,
    getProductById: useCallback(async (id: string) => {
      await delay(MOCK_API_DELAY_MS);
      return fullItems.find((item) => item.id === id);
    }, []),
    getTestimonials: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      return reviews;
    }, []),
    getHomepageContent: useCallback(async () => {
      await delay(MOCK_API_DELAY_MS);
      const dynamicCards = infoCards.map((card) =>
        card.title === 'Free Shipping'
          ? { ...card, content: `Free shipping for 150$ and up` }
          : card
      );
      return {
        photoShoots,
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
        headerMessage: 'Free shipping with over $150',
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
function sortItems<T extends Product>(items: T[], sortBy?: string): T[] {
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

export const mockSendContactMessage = async (messageData: {
  name: string;
  email: string;
  message: string;
}) => {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));
  // You could add logic here to "fail" for testing if you want

  // Save messages to localStorage for demo purposes
  const messages = JSON.parse(localStorage.getItem('mock-contact-messages') || '[]');
  messages.push({ ...messageData, id: Date.now() });
  localStorage.setItem('mock-contact-messages', JSON.stringify(messages));

  return true; // success
};

// -----------------------------
// SHIPPING INFORMATION MOCK
// -----------------------------

interface ShippingInfo {
  country: string;
  firstName: string;
  lastName: string;
  region: string;
  address: string;
  town: string;
  phone: string;
}

const SHIPPING_INFO_STORAGE_KEY = 'mock-user-shipping-info';

export const mockSaveShippingInfo = async (userEmail: string, shippingInfo: ShippingInfo) => {
  await delay(MOCK_API_DELAY_MS);

  const stored = localStorage.getItem(SHIPPING_INFO_STORAGE_KEY);
  const allShippingInfo: Record<string, ShippingInfo> = stored ? JSON.parse(stored) : {};

  allShippingInfo[userEmail] = shippingInfo;
  localStorage.setItem(SHIPPING_INFO_STORAGE_KEY, JSON.stringify(allShippingInfo));

  return true;
};

export const mockFetchShippingInfo = async (userEmail: string): Promise<ShippingInfo | null> => {
  await delay(MOCK_API_DELAY_MS);

  const stored = localStorage.getItem(SHIPPING_INFO_STORAGE_KEY);
  const allShippingInfo: Record<string, ShippingInfo> = stored ? JSON.parse(stored) : {};

  return allShippingInfo[userEmail] || null;
};

// -----------------------------
// PRODUCT REVIEWS MOCK
// -----------------------------

interface ProductReview extends Review {
  id: string;
  productId: string;
  userEmail: string;
  date: string;
}

const REVIEWS_STORAGE_KEY = 'mock-product-reviews';

export const mockAddProductReview = async (userEmail: string, review: Review) => {
  await delay(MOCK_API_DELAY_MS);

  const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
  const allReviews: ProductReview[] = stored ? JSON.parse(stored) : [];
  const productId = review.productId;
  const newReview: ProductReview = {
    id: `${productId}-${userEmail}-${Date.now()}`,
    productId,
    userEmail,
    rating: review.rating,
    comment: review.comment,
    avatarUrl: review.avatarUrl,
    name: review.name,
    orderId: review.orderId,
    date: new Date().toISOString(),
  };

  allReviews.push(newReview);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews));

  return newReview;
};

export const mockFetchProductReviews = async (
  productId: string,
  page: number = 1,
  pageSize: number = 5
): Promise<{
  items: ProductReview[];
  page: number;
  totalPages: number;
  totalItems: number;
}> => {
  await delay(MOCK_API_DELAY_MS);

  const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
  const allReviews: ProductReview[] = stored ? JSON.parse(stored) : [];

  const filtered = allReviews.filter((r) => r.productId === productId);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: filtered.slice(start, end),
    page: currentPage,
    totalPages,
    totalItems,
  };
};
export const getPolicies = async () => {
  await delay(MOCK_API_DELAY_MS);

  return {
    return: {
      title: 'Return Policy',
      content:
        'You can return any item within 30 days of receipt for a full refund. The item must be unused and in its original packaging.',
    },
    cancel: {
      title: 'Cancel Order Policy',
      content:
        'Orders can be canceled within 2 hours of placing them. After that, they may already be in processing and cannot be canceled.',
    },
    shipping: {
      title: 'Shipping Policy',
      content:
        'We offer standard and express shipping. Free shipping is available for orders over $150.',
    },
  };
};

export const getRelatedProducts = async (productId: string, page = 1, pageSize = 6) => {
  await delay(MOCK_API_DELAY_MS);

  const related = toys.filter((item) => item.id !== productId);

  const totalItems = related.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: related.slice(startIndex, endIndex),
    page: currentPage,
    totalPages,
    totalItems,
  };
};

export const mockFetchContactInfo = (): Promise<{
  contactDetails: {
    iconName: string;
    title: string;
    content: string;
    appearance: string;
  }[];
}> => {
  return Promise.resolve([
    {
      title: 'Work days',
      content: 'Monday to Friday',
      id: 'work-days',
    },
    {
      title: 'Work times',
      content: '10am - 6pm (Palestine time)',
      id: 'work-times',
    },
    {
      title: 'Phone',
      content: '+1 234 567 8900',
      id: 'phone',
    },
    {
      title: 'Email',
      content: 'support@toystore.com',
      id: 'email',
    },
    {
      title: 'Address',
      content: '123 Toy Lane, Playtown, USA',
      id: 'address',
    },
  ]);
};

// -----------------------------
// TODO: Must Have (Core Functionality)
// -----------------------------
// [ ] Add Order Status Tracking && Allow User to Add Review Only After Delivery (after admin panel support)
// [ ] Add coupon system
// [ ] Handle out-of-stock products gracefully, gray out instead of hard remove from cart
// [ ] Prevent race condition when placing orders
// [ ] Add analytics tracking events
// [ ] Improve search with suggestions/autocomplete
// [ ] Add profile settings for user (name/email/password)

// -----------------------------
// TODO: Nice to Have (Optional / Stretch Features)
// -----------------------------
// [ ] Support multiple shipping addresses
// [ ] Add product variant system (color, size, etc.)
// [ ] Add admin dashboard (orders, products, reviews)
// [ ] Remind users of abandoned cart after some time

//Add Order Status Tracking & Allow User to Add Review Only After Delivery
// pending — order placed
// processing — admin is preparing the order
// shipped — order sent to delivery
// delivered — user has received the order
// cancelled — admin canceled the order

// How to Manage Stock Properly (https://chatgpt.com/c/686bb8d1-f638-8009-8fc9-eeb4df0fc449)
// 1. Stock Reservation on Order Placement (Pending Status)
// When a user places an order, reserve the quantity in stock by reducing available stock immediately to prevent overselling.
// Mark the order as pending — stock is reserved but not yet deducted permanently.
// 2. Stock Confirmation on Order Processing
// When admin moves order status from pending → processing, confirm the reservation (stock remains deducted).
// If admin cancels the order while pending or processing, release the reserved stock back to availability.
