export type TownAnalyticsRow = {
  townCode: string;
  ordersLast30Days: number;
  revenueLast30Days: number; // decimal -> number
  averageOrderValueLast30Days: number;
  ordersPrevious30Days: number;
  revenuePrevious30Days: number;
  ordersGrowthRate: number; // 0.1234 -> 12.34%
  revenueGrowthRate: number;
  failedDeliveriesLast30Days: number;
  guestOrdersLast30Days: number;
  refreshedAt: string; // ISO datetime
};
