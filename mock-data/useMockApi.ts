import { useCallback } from 'react';
import {
  toys,
  reviews,
  infoCards,
  photoShoots,
  unifiedCategories,
  description,
  brandsRadioOptions,
  colorsRadioOptions,
  DEFAULT_PRICE,
  materialsRadioOptions,
} from './mock-data';
import type {
  CartItem,
  Review,
  OrderItem,
  CartItemBE,
  Product,
  ProductWithFavorite,
  OrderPayload,
  ShippingInfo,
  Category,
  ProductAvailability,
  LoginResponse,
  RegisterResponse,
  User,
  ShopFilterOptions,
  AdminDashboardStats,
  AdminProduct,
  AdminOrder,
  AdminDashboardData,
  Policy,
  RelatedProducts,
  ContactInfo,
} from '../packages/types/src/index';

export const MOCK_API_DELAY_MS = 600;

// Helper to add delay to any promise
const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

// Mocked API to simulate categories fetching
export const getProductCategories = async (): Promise<Category[]> => {
  await delay(MOCK_API_DELAY_MS);
  return unifiedCategories;
};

// STOCK MANAGEMENT MOCK LOGIC
export const mockFetchProductAvailability = async (
  productId: string
): Promise<ProductAvailability> => {
  await delay(MOCK_API_DELAY_MS / 2); // Faster check
  const product = toys.find((p) => p.id === productId);
  if (!product) {
    return { availableStock: 0 };
  }
  return { availableStock: product.availableInStock };
};

// AUTH & CLOUD SYNC MOCK LOGIC
export const mockLoginApi = async (email: string, password: string): Promise<LoginResponse> => {
  await delay(MOCK_API_DELAY_MS);
  // Demo credentials: user@example.com / password123
  if (email === 'admin@example.com' && password === 'password') {
    return { email, token: 'mock-admin-token', role: 'admin' };
  }
  if ((email === 'user@example.com' && password === 'password123') || (email && password)) {
    return { email, token: 'mock-token', role: 'customer' };
  }
  throw new Error('Invalid credentials');
};

export const mockRegisterApi = async (
  email: string,
  password: string
): Promise<RegisterResponse> => {
  await delay(MOCK_API_DELAY_MS);
  if (email && password) return { email, token: 'mock-token' };
  throw new Error('Registration failed');
};

export const mockFetchUserApi = async (token: string): Promise<User> => {
  await delay(MOCK_API_DELAY_MS);
  if (token === 'mock-token') {
    return { id: '1', name: 'Mock User', email: 'user@example.com', role: 'customer' };
  } else if (token === 'mock-admin-token') {
    return { id: '2', name: 'Mock Admin', email: 'admin@example.com', role: 'admin' };
  }
  throw new Error('Invalid token');
};

// CLOUD STORAGE MOCKS
export const mockPlaceOrder = async (order: OrderPayload): Promise<void> => {
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

  const subtotal = order.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const token = localStorage.getItem('auth_token');
  let userIdentifier: string | undefined;

  if (token === 'mock-token') {
    userIdentifier = 'user@example.com';
  } else if (order.shippingInfo?.phone) {
    userIdentifier = order.shippingInfo.phone;
  } else {
    throw new Error('Missing user identifier (phone or email) for order');
  }

  if (order.shippingInfo && userIdentifier) {
    await mockSaveShippingInfo(userIdentifier, order.shippingInfo);
  }

  const newOrder: OrderItem = {
    id: Date.now(),
    email: userIdentifier,
    date: new Date().toISOString(),
    cartItems: order.cartItems,
    subtotal,
    shippingCost: order.shippingCost || 0,
    total: order.total,
    shippingInfo: order.shippingInfo,
    status: 'pending', // Add default status
  };

  orders.push(newOrder);
  localStorage.setItem('mock-orders', JSON.stringify(orders));
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

  allOrders.sort(
    (a: OrderItem, b: OrderItem) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalItems = allOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
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

export const mockSaveCartToCloud = async (cartItems: CartItemBE[]): Promise<void> => {
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

function triggerWishlistChange(): void {
  localStorage.setItem('cloud-favorites-timestamp', Date.now().toString());
}

export const mockAddToWishlist = async (productId: string): Promise<void> => {
  const data = localStorage.getItem('cloud-favorites');
  const favs: string[] = data ? JSON.parse(data) : [];

  if (!favs.includes(productId)) {
    favs.push(productId);
    localStorage.setItem('cloud-favorites', JSON.stringify(favs));
    triggerWishlistChange();
  }
};

export const mockRemoveFromWishlist = async (productId: string): Promise<void> => {
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

// SHOP FILTER OPTIONS
export const getShopFilterOptions = async (): Promise<ShopFilterOptions> => {
  await delay(MOCK_API_DELAY_MS);
  return {
    colors: colorsRadioOptions,
    brands: brandsRadioOptions,
    materials: materialsRadioOptions,
    priceRange: DEFAULT_PRICE,
  };
};

// PRODUCTS & HOME DATA (MOCKED) - Storefront
export function useMockProductsApi(pageSize: number = 10) {
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

      // Filtering logic...
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
        filteredItems = filteredItems.filter((item) =>
          (item.color as string[]).includes(filters.color)
        );
      }

      filteredItems = sortItems(filteredItems, filters.sortBy);

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
        endTime: new Date(Date.now() + 1000 * 60).toISOString(),
        title: 'Flash Sale!',
        icon: 'faBolt',
      };
    }, []),
  };
}

// ADMIN API
export function useMockAdminApi(): AdminDashboardData {
  const getProducts = async (page = 1, pageSize = 10, filters: any = {}): Promise<AdminProduct> => {
    await delay(MOCK_API_DELAY_MS);
    let filteredItems = [...toys];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filteredItems = filteredItems.filter((item) => item.name.toLowerCase().includes(term));
    }

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginated = filteredItems.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, page, totalPages, totalItems };
  };

  const getProductById = async (id: string): Promise<Product | undefined> => {
    await delay(MOCK_API_DELAY_MS);
    return toys.find((item) => item.id === id);
  };

  const addProduct = async (product: Product): Promise<Product> => {
    await delay(MOCK_API_DELAY_MS);
    const newProduct = { ...product, id: Date.now().toString() };
    toys.unshift(newProduct);
    return newProduct;
  };

  const updateProduct = async (product: Product): Promise<Product> => {
    await delay(MOCK_API_DELAY_MS);
    const index = toys.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      toys[index] = product;
      return product;
    }
    throw new Error('Product not found');
  };

  const deleteProduct = async (productId: string): Promise<{ success: boolean }> => {
    await delay(MOCK_API_DELAY_MS);
    const index = toys.findIndex((p) => p.id === productId);
    if (index !== -1) {
      toys.splice(index, 1);
      return { success: true };
    }
    throw new Error('Product not found');
  };

  const deleteProducts = async (productIds: string[]): Promise<{ success: boolean }> => {
    await delay(MOCK_API_DELAY_MS);
    productIds.forEach((productId) => {
      const index = toys.findIndex((p) => p.id === productId);
      if (index !== -1) {
        toys.splice(index, 1);
      }
    });
    return { success: true };
  };

  const getCategories = async (): Promise<Category[]> => {
    await delay(MOCK_API_DELAY_MS);
    return unifiedCategories;
  };

  const addCategory = async (category: { name: string; image: string }): Promise<Category> => {
    await delay(MOCK_API_DELAY_MS);
    const newCategory = {
      ...category,
      id: Date.now().toString(),
      name: category.name,
      image: category.image,
    };
    unifiedCategories.push(newCategory);
    return newCategory;
  };

  const updateCategory = async (category: {
    id: string;
    name: string;
    image: string;
  }): Promise<Category> => {
    await delay(MOCK_API_DELAY_MS);
    const index = unifiedCategories.findIndex((c) => c.id === category.id);
    if (index !== -1) {
      unifiedCategories[index] = { ...unifiedCategories[index], ...category };
      return unifiedCategories[index];
    }
    throw new Error('Category not found');
  };

  const deleteCategory = async (categoryId: string): Promise<{ success: boolean }> => {
    await delay(MOCK_API_DELAY_MS);
    const index = unifiedCategories.findIndex((c) => c.id === categoryId);
    if (index !== -1) {
      unifiedCategories.splice(index, 1);
      return { success: true };
    }
    throw new Error('Category not found');
  };

  const getOrders = async (page = 1, pageSize = 10, filters: any = {}): Promise<AdminOrder> => {
    await delay(MOCK_API_DELAY_MS);
    const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');

    let filteredOrders = allOrders;

    if (filters.status) {
      filteredOrders = filteredOrders.filter((o) => o.status === filters.status);
    }

    filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginated = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, page, totalPages, totalItems };
  };

  const getOrderById = async (id: number): Promise<OrderItem | undefined> => {
    await delay(MOCK_API_DELAY_MS);
    const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');
    return allOrders.find((o) => o.id === id);
  };

  const updateOrderStatus = async (orderId: number, status: string): Promise<OrderItem> => {
    await delay(MOCK_API_DELAY_MS);
    const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');
    const orderIndex = allOrders.findIndex((o) => o.id === orderId);

    if (orderIndex !== -1) {
      allOrders[orderIndex].status = status;

      if (status === 'shipped') {
        const order = allOrders[orderIndex];
        for (const item of order.cartItems) {
          const product = toys.find((p) => p.id === item.productId);
          if (product) {
            product.availableInStock -= item.quantity;
          }
        }
      }

      if (status === 'cancelled') {
        const order = allOrders[orderIndex];
        for (const item of order.cartItems) {
          const product = toys.find((p) => p.id === item.productId);
          if (product) {
            product.availableInStock += item.quantity;
          }
        }
      }

      localStorage.setItem('mock-orders', JSON.stringify(allOrders));
      return allOrders[orderIndex];
    }

    throw new Error('Order not found');
  };

  const getDashboardStats = async (): Promise<AdminDashboardStats> => {
    await delay(MOCK_API_DELAY_MS);
    const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');

    const totalProducts = toys.length;
    const totalOrders = allOrders.length > 0 ? allOrders.length : 25;
    const pendingOrders =
      allOrders.length > 0 ? allOrders.filter((o) => o.status === 'pending').length : 5;
    const totalRevenue =
      allOrders.length > 0 ? allOrders.reduce((sum, order) => sum + order.total, 0) : 12500;
    const lowStockProductsCount = toys.filter((p) => p.availableInStock < 10).length;
    const totalCustomers =
      new Set(allOrders.map((o) => o.email)).size > 0
        ? new Set(allOrders.map((o) => o.email)).size
        : 15;

    const salesData = generateSalesData();

    const categoryDistribution = toys.reduce((acc, toy) => {
      acc[toy.category] = (acc[toy.category] || 0) + (toy.sales || 0);
      return acc;
    }, {});

    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      lowStockProducts: lowStockProductsCount,
      totalCustomers,
      salesData,
      categoryDistribution,
    };
  };

  const getLowStockProducts = async (limit = 5): Promise<Product[]> => {
    await delay(MOCK_API_DELAY_MS);
    const lowStock = toys.filter((p) => p.availableInStock < 10).slice(0, limit);
    return lowStock;
  };

  const getTopSellingProducts = async (limit = 5): Promise<Product[]> => {
    await delay(MOCK_API_DELAY_MS);
    const topSelling = [...toys].sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0)).slice(0, limit);
    return topSelling;
  };

  const getRecentOrders = async (limit = 5): Promise<OrderItem[]> => {
    await delay(MOCK_API_DELAY_MS);
    const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');
    const recent = allOrders
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
    return recent;
  };

  const mockAdminLogin = async (
    username,
    password
  ): Promise<{
    token: string;
  }> => {
    await delay(MOCK_API_DELAY_MS);
    if (username === 'admin' && password === 'password') {
      return { token: 'mock-admin-token' };
    }
    throw new Error('Invalid credentials');
  };

  const getOrderStatusBreakdown = async (): Promise<Record<string, number>> => {
    await delay(MOCK_API_DELAY_MS);
    const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');

    const statusCounts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    for (const order of allOrders) {
      const status = order.status ?? 'pending';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }

    return statusCounts;
  };

  const getCategoryDistribution = async (): Promise<{
    totalSales: number;
    categoryDistribution: {
      category: string;
      salesCount: number;
      percentage: number;
    }[];
  }> => {
    await delay(MOCK_API_DELAY_MS);

    const categorySalesMap: Record<string, number> = toys.reduce((acc, toy) => {
      acc[toy.category] = (acc[toy.category] || 0) + (toy.sales || 0);
      return acc;
    }, {});

    const totalSales = Object.values(categorySalesMap).reduce((sum, val) => sum + val, 0);

    const categoryDistribution = Object.entries(categorySalesMap).map(([category, salesCount]) => ({
      category,
      salesCount,
      percentage: totalSales ? Math.round((salesCount / totalSales) * 100) : 0,
    }));

    return {
      totalSales,
      categoryDistribution,
    };
  };

  return {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getDashboardStats,
    getLowStockProducts,
    getTopSellingProducts,
    getRecentOrders,
    mockAdminLogin,
    getOrderStatusBreakdown,
    getCategoryDistribution,
    getColors: async () => {
      await delay(MOCK_API_DELAY_MS);
      return colorsRadioOptions;
    },
    getMaterials: async () => {
      await delay(MOCK_API_DELAY_MS);
      return materialsRadioOptions;
    },
    getBrands: async () => {
      await delay(MOCK_API_DELAY_MS);
      return brandsRadioOptions;
    },
  };
}

// Helpers
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
      return [...items];
  }
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const generateSalesData = () => {
  const salesData: { date: string; sales: number }[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 29);

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    salesData.push({
      date: d.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
    });
  }
  return salesData;
};

export const mockSendContactMessage = async (messageData: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const messages = JSON.parse(localStorage.getItem('mock-contact-messages') || '[]');
  messages.push({ ...messageData, id: Date.now() });
  localStorage.setItem('mock-contact-messages', JSON.stringify(messages));
  return true;
};

// SHIPPING INFORMATION MOCK
const SHIPPING_INFO_STORAGE_KEY = 'mock-user-shipping-info';

export const mockSaveShippingInfo = async (
  userEmail: string,
  shippingInfo: ShippingInfo
): Promise<boolean> => {
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

// PRODUCT REVIEWS MOCK
interface ProductReview extends Review {
  id: string;
  productId: string;
  userEmail: string;
  date: string;
}

const REVIEWS_STORAGE_KEY = 'mock-product-reviews';

export const mockAddProductReview = async (
  userEmail: string,
  review: Review
): Promise<ProductReview> => {
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

export const getPolicies = async (): Promise<Policy> => {
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

export const getRelatedProducts = async (
  productId: string,
  page = 1,
  pageSize = 6
): Promise<RelatedProducts> => {
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

export const mockFetchContactInfo = (): Promise<ContactInfo[]> => {
  // Type was complex, using any for now
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
