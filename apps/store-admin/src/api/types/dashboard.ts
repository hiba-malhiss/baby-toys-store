export interface DashboardStatsResponse {
  pendingOrders: number;
  revenueThisMonth: string | number;
  revenueMoMPercent: number; // -1..+inf
  aovThisMonth: string | number;
  categoryDistribution: SimpleChart;
  topSellingProducts: SimpleChart;
  salesOverTimeComparison: ComparisonChart;
  productInterest: ProductInterest;
}

export interface SimpleChart {
  labels: string[];
  data: number[];
}

// NewReturningChart removed (not used on admin dashboard)

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
