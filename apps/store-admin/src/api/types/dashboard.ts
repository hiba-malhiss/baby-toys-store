export interface DashboardStatsResponse {
  totalOrders: number;
  pendingOrders: number;
  revenueThisMonth: string | number;
  revenuePrevMonth: string | number;
  revenueMoMPercent: number; // -1..+inf
  aovThisMonth: string | number;
  categoryDistribution: SimpleChart;
  topSellingProducts: SimpleChart;
  salesOverTimeComparison: ComparisonChart;
  newVsReturningCustomers: NewReturningChart;
  productInterest: ProductInterest;
}

export interface SimpleChart {
  labels: string[];
  data: number[];
}

export interface NewReturningChart {
  labels: string[];
  newData: number[];
  returningData: number[];
}

export interface ComparisonChart {
  labels: string[];
  current: number[];
  previous: number[];
}

export interface ProductInterest {
  topViewed: SimpleChart;
  topWishlisted: SimpleChart;
  topAddedToCart: SimpleChart;
  funnel: FunnelRow[];
}

export interface FunnelRow {
  productId: number;
  name: string;
  views: number;
  wishlist: number;
  addToCart: number;
  purchases: number;
  viewToWishlistRate: number;
  wishlistToCartRate: number;
  cartToPurchaseRate: number;
}
