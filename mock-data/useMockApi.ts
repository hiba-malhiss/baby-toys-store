import { useCallback } from 'react';
import {
  toys,
  reviews,
  infoCards,
  photoShoots,
  unifiedCategories,
  description,
  mockColors,
  mockMaterials,
  mockBrands,
} from './mock-data';
import { mockOrders } from './orders';
import {
  Brand,
  CartItem,
  Color,
  Material,
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
  AdminDashboardStats,
  AdminProduct,
  AdminOrder,
  Policy,
  RelatedProducts,
  ContactInfo,
  CategoryDistribution,
  ContactMessage,
  CategoryDistributionItem,
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

  const subtotal = order.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const token = localStorage.getItem('auth_token');
  let userIdentifier: string | undefined;

  if (token) {
    const user = await mockFetchUserApi(token);
    userIdentifier = user.email;
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

  mockOrders.push(newOrder);
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

  const allOrders: OrderItem[] = mockOrders.filter((o: OrderItem) => o.email === userEmail);

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

export const getPriceRange = async (): Promise<[number, number]> => {
  await delay(MOCK_API_DELAY_MS);

  if (toys.length === 0) {
    return [0, 1000]; // Default range if no products
  }

  const prices = toys.map((toy) => toy.price);
  const min = Math.floor(Math.min(...prices));
  const max = Math.ceil(Math.max(...prices));

  // Round to nearest 100 for nice filter values
  return [Math.floor(min / 100) * 100, Math.ceil(max / 100) * 100];
};

// PRODUCTS & HOME DATA (MOCKED) - Storefront
export function useMockProductsApi(pageSize: number = 10) {
  const fullItems = toys;

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

      let filteredItems: Product[] = fullItems;

      // Filtering logic...
      if (filters.category && filters.category !== 'all') {
        filteredItems = filteredItems.filter((item) => item.categoryId === filters.category);
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        filteredItems = filteredItems.filter((item) =>
          [item.name, item.description, item.categoryId].some((field) =>
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
        filteredItems = filteredItems.filter((item) => item.brandId === filters.brand);
      }
      if (filters.material) {
        filteredItems = filteredItems.filter((item) =>
          (item.materialIds as string[]).includes(filters.material)
        );
      }
      if (filters.color) {
        filteredItems = filteredItems.filter((item) =>
          (item.colorId as string[]).includes(filters.color)
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
    getColors: async (): Promise<Color[]> => {
      await delay(MOCK_API_DELAY_MS);
      return mockColors;
    },
    getMaterials: async (): Promise<Material[]> => {
      await delay(MOCK_API_DELAY_MS);
      return mockMaterials;
    },
    getBrands: async (): Promise<Brand[]> => {
      await delay(MOCK_API_DELAY_MS);
      return mockBrands;
    },
    getCategories: async (): Promise<Category[]> => {
      await delay(MOCK_API_DELAY_MS);
      return unifiedCategories;
    },
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
export function useMockAdminApi(): {
  getTopSellingProducts: (limit?: number) => Promise<Product[]>;
  getBrands: () => Promise<Brand[]>;
  getOrderById: (id: number) => Promise<OrderItem | undefined>;
  updateOrder: (order: OrderItem) => Promise<OrderItem>;
  addProduct: (product: Product) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;
  getDashboardStats: () => Promise<AdminDashboardStats>;
  updateBrand: (brand: {
    id: string;
    name: string;
    logo: string;
    description?: string;
  }) => Promise<Brand>;
  updateCategory: (category: { id: string; name: string; image: string }) => Promise<Category>;
  mockAdminLogin: (username, password) => Promise<{ token: string }>;
  getProductById: (id: string) => Promise<Product | undefined>;
  addCategory: (category: { name: string; image: string }) => Promise<Category>;
  getRecentOrders: (limit?: number) => Promise<OrderItem[]>;
  deleteBrand: (brandId: string) => Promise<{ success: boolean }>;
  getLowStockProducts: (limit?: number) => Promise<Product[]>;
  getCategories: () => Promise<Category[]>;
  addBrand: (brand: { name: string; logo: string; description?: string }) => Promise<Brand>;
  getProducts: (page?: number, pageSize?: number, filters?: any) => Promise<AdminProduct>;
  deleteProduct: (productId: string) => Promise<{ success: boolean }>;
  deleteProducts: (productIds: string[]) => Promise<{ success: boolean }>;
  getOrderStatusBreakdown: () => Promise<Record<string, number>>;
  deleteCategory: (categoryId: string) => Promise<{ success: boolean }>;
  getOrders: (page?: number, pageSize?: number, filters?: any) => Promise<AdminOrder>;
  updateOrderStatus: (orderId: number, status: string) => Promise<OrderItem>;
  getCategoryDistribution: () => Promise<CategoryDistribution>;
  getCustomers: () => Promise<User[]>;
  getReviews: () => Promise<Review[]>;
  deleteReview: (reviewId: string) => Promise<{ success: boolean }>;
  getHomepageContent: () => Promise<any>;
  updateHomepageContent: (data: any) => Promise<any>;
  getCurrencySettings: () => Promise<any>;
  updateCurrencySettings: (data: any) => Promise<any>;
  getShippingSettings: () => Promise<any>;
  updateShippingSettings: (data: any) => Promise<any>;
  getMaterials: () => Promise<Material[]>;
  getColors: () => Promise<Color[]>;
  deleteOrder: (orderId: number) => Promise<{ success: boolean }>;
  updateOrderItem: (
    orderId: number,
    itemId: string,
    quantity: number
  ) => Promise<OrderItem | undefined>;
  deleteOrderItem: (orderId: number, itemId: string) => Promise<OrderItem | undefined>;
} {
  // COLORS
  const getColors = () => {
    return mockColors;
  };

  const addColor = (newColor: Color) => {
    const exists = mockColors.some(
      (color) => color.name === newColor.name || color.code === newColor.code
    );
    if (!exists) {
      mockColors.push({ id: Date.now(), ...newColor });
    }
    return mockColors;
  };

  const deleteColor = (id: string) => {
    const index = mockColors.findIndex((color) => color.id === id);
    if (index !== -1) {
      mockColors.splice(index, 1);
    }
    return mockColors;
  };

  const updateColor = (updatedColor: Color) => {
    const index = mockColors.findIndex((color) => color.id === updatedColor.id);
    if (index !== -1) {
      mockColors[index] = { ...mockColors[index], ...updatedColor };
    }
    return mockColors;
  };

  const getMaterials = () => {
    return mockMaterials;
  };

  const addMaterial = (newMaterial: Material) => {
    const exists = mockMaterials.some((mat) => mat.name === newMaterial.name);
    if (!exists) {
      mockMaterials.push({ id: Date.now(), ...newMaterial });
    }
    return mockMaterials;
  };

  const deleteMaterial = (id: string) => {
    const index = mockMaterials.findIndex((mat) => mat.id === id);
    if (index !== -1) {
      mockMaterials.splice(index, 1);
    }
    return mockMaterials;
  };

  const updateMaterial = (updatedMaterial: Material) => {
    const index = mockMaterials.findIndex((mat) => mat.id === updatedMaterial.id);
    if (index !== -1) {
      mockMaterials[index] = { ...mockMaterials[index], ...updatedMaterial };
    }
    return mockMaterials;
  };

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

  const getBrands = async (): Promise<Brand[]> => {
    await delay(MOCK_API_DELAY_MS);
    return mockBrands;
  };

  const addBrand = async (brand: {
    name: string;
    logo: string;
    description?: string;
  }): Promise<Brand> => {
    await delay(MOCK_API_DELAY_MS);
    const newBrand: Brand = {
      ...brand,
      id: Date.now().toString(),
    };
    mockBrands.push(newBrand);
    return newBrand;
  };

  const updateBrand = async (brand: {
    id: string;
    name: string;
    logo: string;
    description?: string;
  }): Promise<Brand> => {
    await delay(MOCK_API_DELAY_MS);
    const index = mockBrands.findIndex((b) => b.id === brand.id);
    if (index !== -1) {
      mockBrands[index] = { ...mockBrands[index], ...brand };
      return mockBrands[index];
    }
    throw new Error('Brand not found');
  };

  const deleteBrand = async (brandId: string): Promise<{ success: boolean }> => {
    await delay(MOCK_API_DELAY_MS);
    const index = mockBrands.findIndex((b) => b.id === brandId);
    if (index !== -1) {
      mockBrands.splice(index, 1);
      return { success: true };
    }
    throw new Error('Brand not found');
  };

  const getOrders = async (page = 1, pageSize = 10, filters: any = {}): Promise<AdminOrder> => {
    await delay(MOCK_API_DELAY_MS);
    let filteredOrders = [...mockOrders];

    if (filters.status) {
      filteredOrders = filteredOrders.filter((o) => o.status === filters.status);
    }

    if (filters.email) {
      const searchTerm = filters.email.toLowerCase();
      filteredOrders = filteredOrders.filter((o) => o.email.toLowerCase().includes(searchTerm));
    }

    if (filters.city) {
      const searchTerm = filters.city.toLowerCase();
      filteredOrders = filteredOrders.filter((o) =>
        o.shippingInfo?.town?.toLowerCase().includes(searchTerm)
      );
    }

    filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginated = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, page, totalPages, totalItems };
  };

  const getOrderById = async (id: number): Promise<OrderItem | undefined> => {
    await delay(MOCK_API_DELAY_MS);
    return mockOrders.find((o) => o.id === id);
  };

  const updateOrderStatus = async (orderId: number, status: string): Promise<OrderItem> => {
    await delay(MOCK_API_DELAY_MS);
    const orderIndex = mockOrders.findIndex((o) => o.id === orderId);

    if (orderIndex !== -1) {
      mockOrders[orderIndex].status = status;

      if (status === 'cancelled') {
        const order = mockOrders[orderIndex];
        for (const item of order.cartItems) {
          const product = toys.find((p) => p.id === item.productId);
          if (product) {
            product.availableInStock += item.quantity;
          }
        }
      }

      return mockOrders[orderIndex];
    }

    throw new Error('Order not found');
  };

  const updateOrder = async (order: OrderItem): Promise<OrderItem> => {
    await delay(MOCK_API_DELAY_MS);
    const index = mockOrders.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      mockOrders[index] = order;
      return order;
    }
    throw new Error('Order not found');
  };

  const deleteOrder = async (orderId: number): Promise<{ success: boolean }> => {
    await delay(MOCK_API_DELAY_MS);
    const index = mockOrders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      mockOrders.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  };

  const updateOrderItem = async (
    orderId: number,
    itemId: string,
    quantity: number
  ): Promise<OrderItem | undefined> => {
    await delay(MOCK_API_DELAY_MS);
    const order = mockOrders.find((o) => o.id === orderId);
    if (order) {
      const item = order.cartItems.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
    }
    return order;
  };

  const deleteOrderItem = async (
    orderId: number,
    itemId: string
  ): Promise<OrderItem | undefined> => {
    await delay(MOCK_API_DELAY_MS);
    const order = mockOrders.find((o) => o.id === orderId);
    if (order) {
      order.cartItems = order.cartItems.filter((i) => i.id !== itemId);
    }
    return order;
  };

  const getDashboardStats = async (): Promise<AdminDashboardStats> => {
    await delay(MOCK_API_DELAY_MS);

    const totalProducts = toys.length;
    const totalOrders = mockOrders.length > 0 ? mockOrders.length : 25;
    const pendingOrders =
      mockOrders.length > 0 ? mockOrders.filter((o) => o.status === 'pending').length : 5;
    const totalRevenue =
      mockOrders.length > 0 ? mockOrders.reduce((sum, order) => sum + order.total, 0) : 12500;
    const lowStockProductsCount = toys.filter((p) => p.availableInStock < 10).length;
    const totalCustomers =
      new Set(mockOrders.map((o) => o.email)).size > 0
        ? new Set(mockOrders.map((o) => o.email)).size
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
    const recent = mockOrders
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

    const statusCounts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    for (const order of mockOrders) {
      const status = order.status ?? 'pending';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }

    return statusCounts;
  };

  const getCategoryDistribution = async (): Promise<CategoryDistribution> => {
    await delay(MOCK_API_DELAY_MS);

    // Get all categories to map values to names
    const categories = await getProductCategories();
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

    // Group sales by category value
    const categorySalesMap: Record<string, { name: string; sales: number }> = {};

    toys.forEach((toy) => {
      const category = categoryMap.get(toy.categoryId);
      const categoryName = category?.name || 'Uncategorized';

      if (!categorySalesMap[toy.categoryId]) {
        categorySalesMap[toy.categoryId] = {
          name: categoryName,
          sales: toy.sales || 0,
        };
      }

      categorySalesMap[toy.categoryId].sales += toy.sales || 0;
    });

    const totalSales = Object.values(categorySalesMap).reduce((sum, { sales }) => sum + sales, 0);

    const categoryDistributions: CategoryDistributionItem[] = Object.entries(categorySalesMap).map(
      ([categoryId, { name, sales }]) => ({
        category: name,
        salesCount: sales,
        percentage: totalSales ? Math.round((sales / totalSales) * 100) : 0,
      })
    );

    return {
      totalSales,
      categoryDistributions,
    };
  };

  return {
    getColors,
    addColor,
    deleteColor,
    updateColor,
    getMaterials,
    addMaterial,
    deleteMaterial,
    updateMaterial,
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
    getBrands,
    addBrand,
    updateBrand,
    deleteBrand,
    getOrders,
    getOrderById,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    updateOrderItem,
    deleteOrderItem,
    getDashboardStats,
    getLowStockProducts,
    getTopSellingProducts,
    getRecentOrders,
    mockAdminLogin,
    getOrderStatusBreakdown,
    getCategoryDistribution,
    getCustomers: async (): Promise<User[]> => {
      await delay(MOCK_API_DELAY_MS);
      return mockOrders.map((order) => ({
        id: order.email,
        name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
        email: order.email,
        role: 'customer',
      }));
    },
    getReviews: async (): Promise<Review[]> => {
      await delay(MOCK_API_DELAY_MS);
      return reviews;
    },
    deleteReview: async (reviewId: string): Promise<{ success: boolean }> => {
      await delay(MOCK_API_DELAY_MS);
      const index = reviews.findIndex((r) => r.id === reviewId);
      if (index !== -1) {
        reviews.splice(index, 1);
        return { success: true };
      }
      return { success: false };
    },
    getHomepageContent: async (): Promise<any> => {
      await delay(MOCK_API_DELAY_MS);
      return {
        banners: [
          'Discover the Joy of Play',
          'Flash sale 30%',
          'Extra discount for loyal customers',
        ],
      };
    },
    updateHomepageContent: async (data: any): Promise<any> => {
      await delay(MOCK_API_DELAY_MS);
      // In a real app, you would save this to a database.
      console.log('Updated homepage content:', data);
      return data;
    },
    getCurrencySettings: async (): Promise<any> => {
      await delay(MOCK_API_DELAY_MS);
      return { currency: 'USD', symbol: '$' };
    },
    updateCurrencySettings: async (data: any): Promise<any> => {
      await delay(MOCK_API_DELAY_MS);
      // In a real app, you would save this to a database.
      console.log('Updated currency settings:', data);
      return data;
    },
    getShippingSettings: async (): Promise<any> => {
      await delay(MOCK_API_DELAY_MS);
      return {
        cost: 0,
        freeThreshold: 150,
        headerMessage: 'Free shipping with over $150',
      };
    },
    updateShippingSettings: async (data: any): Promise<any> => {
      await delay(MOCK_API_DELAY_MS);
      // In a real app, you would save this to a database.
      console.log('Updated shipping settings:', data);
      return data;
    },
    getColors: async (): Promise<Color[]> => {
      await delay(MOCK_API_DELAY_MS);
      return mockColors;
    },
    getMaterials: async (): Promise<Material[]> => {
      await delay(MOCK_API_DELAY_MS);
      return mockMaterials;
    },
    getBrands: async (): Promise<Brand[]> => {
      await delay(MOCK_API_DELAY_MS);
      return mockBrands;
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

export const mockSendContactMessage = async (messageData: ContactMessage): Promise<boolean> => {
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
