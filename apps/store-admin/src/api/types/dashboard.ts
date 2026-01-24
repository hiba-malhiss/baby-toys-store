export interface DashboardStatsResponse {
  meta?: Meta;
  kpis?: Kpis;

  today?: Today;
  customers?: Customers;
  ratings?: Ratings;
  alerts?: Alerts;

  topProducts?: TopProducts;
  topTown?: TopTown;

  monthly?: Monthly;
  peakHour?: PeakHour;
  lateStuckOrders?: LateStuckOrders;
}

// Backend-aligned nested types
export interface Meta {
  currentDate?: string; // ISO date (LocalDate)
  lastLoginAt?: string; // ISO date-time (Instant)
  timezone?: string;
}

export interface Kpis {
  pendingOrders: number;
  revenueThisMonth: string | number;
  revenueLastMonth: string | number;
  revenueMoMChangeBps: number | null;
  aovThisMonth: string | number;
}

export interface Today {
  salesAmount?: string | number;
  salesYesterdayAmount?: string | number;
  salesChangeVsYesterdayBps?: number | null;

  ordersCount?: number;
  ordersYesterdayCount?: number;
  ordersChangeVsYesterdayBps?: number | null;

  deliveredOrdersCount?: number;
  deliveredOrdersYesterdayCount?: number;
  deliveredOrdersChangeBps?: number | null;

  orderIntakeValue?: string | number;
  orderIntakeValueYesterday?: string | number;
  orderIntakeValueChangeBps?: number | null;

  newCustomersCount?: number;
  returningCustomersCount?: number;

  ordersGoalProgressBps?: number | null;
}

export interface Customers {
  newToday: number;
  returningToday: number;
}

export interface Ratings {
  avgToday: string | number; // BigDecimal serialized
  countToday: number;
}

export interface Alerts {
  urgentCount: number;
  preview?: Array<{
    code: string;
    message: string;
    severity: 'INFO' | 'WARN' | 'CRITICAL' | string;
  }>;
}

export interface TopProductsItem {
  productId: string;
  name: string;
  imageUrl?: string | null;
  soldQuantity: number;
  amount: string | number;
}

export interface TopProducts {
  timeframe: 'TODAY' | 'WEEK' | 'MONTH' | string;
  metric: 'REVENUE' | 'QUANTITY' | string;
  items: TopProductsItem[];
}

export interface TopTown {
  name?: string | null;
  ordersToday: number;
  amountToday?: string | number;
}

export interface Monthly {
  salesToDate: string | number;
  goal?: string | number | null;
  progressBps?: number | null;
  remainingDaysInMonth: number;
}

export interface PeakHour {
  hourLabel?: string | null; // e.g., "14:00"
  amountToday: string | number;
}

export interface LateStuckOrders {
  count: number;
  amount: string | number;
  thresholdDays: number; // e.g., 3 days
}
