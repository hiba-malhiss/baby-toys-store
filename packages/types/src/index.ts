export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  availableInStock: number;
  rating: number;
  releaseDate: string;
  sales: number;
  mainImage: string;
  images: string[];
  oldPrice?: number;
  label?: 'SALE' | 'NEW' | string;
  numberOfRatings: number;
  shortDescription?: string;
  featureBullets?: string[];
  details?: { label: string; value: string }[];
  createdAt?: string;
  updatedAt?: string;
  categoryId: string;
  brandId: string;
  materialIds: string[];
  colorId: string[];
}

export interface ProductWithFavorite extends Product {
  isUserFavorite: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  dateAdded: number;
}

export interface CartItemBE {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  email: string;
  date: string;
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingInfo: ShippingInfo;
  status: string;
}

export interface OrderPayload {
  cartItems: CartItem[];
  shippingInfo: ShippingInfo;
  shippingCost: number;
  total: number;
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  firstName: string;
  lastName: string;
  region: string;
  town: string;
  email?: string;
  zipCode?: string;
}

export interface Review {
  id: string;
  productId: string;
  userEmail: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  name: string;
  orderId: number;
  date: string;
}

export interface InfoCardType {
  appearance?: 'info' | 'warning' | 'success';
  icon: any;
  title: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
}

export interface Color {
  id: string;
  name: string;
  code: string;
}

export interface Material {
  id: string;
  name: string;
  description?: string;
}

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface ProductAvailability {
  availableStock: number;
}

export interface LoginResponse {
  email: string;
  token: string;
  role: UserRole;
}

export interface RegisterResponse {
  email: string;
  token: string;
}

export interface Wishlist {
  items: ProductWithFavorite[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface ShopFilterOptions {
  colors: { value: string; label: string }[];
  brands: { value: string; label: string }[];
  materials: { value: string; label: string }[];
  priceRange: [number, number];
}

export interface CurrencySettings {
  currency: string;
  symbol: string;
}

export interface ShippingSettings {
  cost: number;
  freeThreshold: number;
  headerMessage: string;
}

export interface GlobalSearch {
  products: Product[];
  suggestions: string[];
  categories: Category[];
}

export interface FlashSale {
  message: string;
  endTime: string;
  title: string;
  icon: string;
}

export interface AdminDashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  totalCustomers: number;
  salesData: { date: string; sales: number }[];
  categoryDistribution: Record<string, number>;
}

export interface AdminProduct {
  items: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  image: string;
}

export interface AdminOrder {
  items: OrderItem[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface AdminDashboardData {
  getProducts: (page?: number, pageSize?: number, filters?: any) => Promise<AdminProduct>;
  getProductById: (id: string) => Promise<Product | undefined>;
  addProduct: (product: Product) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<{ success: boolean }>;
  deleteProducts: (productIds: string[]) => Promise<{ success: boolean }>;
  getCategories: () => Promise<Category[]>;
  addCategory: (category: { name: string; image: string }) => Promise<Category>;
  updateCategory: (category: { id: string; name: string; image: string }) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<{ success: boolean }>;
  getOrders: (page?: number, pageSize?: number, filters?: any) => Promise<AdminOrder>;
  getOrderById: (id: number) => Promise<OrderItem | undefined>;
  updateOrderStatus: (orderId: number, status: string) => Promise<OrderItem>;
  getDashboardStats: () => Promise<AdminDashboardStats>;
  getLowStockProducts: (limit?: number) => Promise<Product[]>;
  getTopSellingProducts: (limit?: number) => Promise<Product[]>;
  getRecentOrders: (limit?: number) => Promise<OrderItem[]>;
  mockAdminLogin: (username, password) => Promise<{ token: string }>;
  getOrderStatusBreakdown: () => Promise<Record<string, number>>;
  getCategoryDistribution: () => Promise<{
    totalSales: number;
    categoryDistribution: {
      category: string;
      salesCount: number;
      percentage: number;
    }[];
  }>;
  getColors: () => Promise<{ value: string; label: string }[]>;
  getMaterials: () => Promise<{ value: string; label: string }[]>;
  getBrands: () => Promise<{ value: string; label: string }[]>;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
}

export interface Policy {
  return: { title: string; content: string };
  cancel: { title: string; content: string };
  shipping: { title: string; content: string };
}

export interface RelatedProducts {
  items: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface CategoryDistributionItem {
  category: string;
  salesCount: number;
  percentage: number;
}

export interface CategoryDistribution {
  totalSales: number;
  categoryDistributions: CategoryDistributionItem[];
}

export interface ContactInfo {
  title: string;
  content: string;
  id: string;
}
