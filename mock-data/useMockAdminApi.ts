import { toys } from './toy-card-list';
import { OrderItem } from '../apps/store-admin/src/types/product.types';

export const MOCK_API_DELAY_MS = 600;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Products
export const getProducts = async (page = 1, pageSize = 10, filters: any = {}) => {
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

export const getProductById = async (id: string) => {
  await delay(MOCK_API_DELAY_MS);
  return toys.find((item) => item.id === id);
};

export const addProduct = async (product: Product) => {
  await delay(MOCK_API_DELAY_MS);
  const newProduct = { ...product, id: Date.now().toString() };
  toys.unshift(newProduct);
  return newProduct;
};

export const updateProduct = async (product: Product) => {
  await delay(MOCK_API_DELAY_MS);
  const index = toys.findIndex((p) => p.id === product.id);
  if (index !== -1) {
    toys[index] = product;
    return product;
  }
  throw new Error('Product not found');
};

export const deleteProduct = async (productId: string) => {
  await delay(MOCK_API_DELAY_MS);
  const index = toys.findIndex((p) => p.id === productId);
  if (index !== -1) {
    toys.splice(index, 1);
    return { success: true };
  }
  throw new Error('Product not found');
};

// Orders
export const getOrders = async (page = 1, pageSize = 10, filters: any = {}) => {
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

export const getOrderById = async (id: number) => {
  await delay(MOCK_API_DELAY_MS);
  const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');
  return allOrders.find((o) => o.id === id);
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  await delay(MOCK_API_DELAY_MS);
  const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');
  const orderIndex = allOrders.findIndex((o) => o.id === orderId);

  if (orderIndex !== -1) {
    allOrders[orderIndex].status = status;

    // Release stock if order is cancelled
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

// Dashboard
export const getDashboardStats = async () => {
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

  // Mock sales data for the last 30 days
  const salesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 5000) + 1000,
    };
  }).reverse();

  // Mock category distribution
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

export const getLowStockProducts = async (limit = 5) => {
  await delay(MOCK_API_DELAY_MS);
  const lowStock = toys.filter((p) => p.availableInStock < 10).slice(0, limit);
  return lowStock;
};

export const getTopSellingProducts = async (limit = 5) => {
  await delay(MOCK_API_DELAY_MS);
  const topSelling = [...toys].sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0)).slice(0, limit);
  return topSelling;
};

export const getRecentOrders = async (limit = 5) => {
  await delay(MOCK_API_DELAY_MS);
  const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('mock-orders') || '[]');
  const recent = allOrders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
  return recent;
};

export const mockLogin = async (username, password) => {
  await delay(MOCK_API_DELAY_MS);
  if (username === 'admin' && password === 'password') {
    return { token: 'mock-admin-token' };
  }
  throw new Error('Invalid credentials');
};

export const getOrderStatusBreakdown = async (): Promise<Record<string, number>> => {
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
    const status = order.status ?? 'pending'; // fallback to pending if undefined
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  }

  return statusCounts;
};

export const getCategoryDistribution = async () => {
  await delay(MOCK_API_DELAY_MS);

  const categorySalesMap: Record<string, number> = toys.reduce((acc, toy) => {
    acc[toy.category] = (acc[toy.category] || 0) + (toy.sales ?? 0);
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
