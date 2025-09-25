export interface DashboardStatsResponse {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenueThisMonth: string | number;
  totalCustomers: number;
  salesOverTime: SimpleChart;
  categoryDistribution: SimpleChart;
  orderStatusBreakdown: SimpleChart;
  topSellingProducts: SimpleChart;
  newVsReturningCustomers: NewReturningChart;
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
