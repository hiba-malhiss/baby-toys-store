export const Tooltips = {
  productKPIs: {
    revenueLifetime:
      'Sum of delivered revenue attributed to this product over its lifetime. (Total money collected from delivered orders for this product.)',
    profitLifetime:
      'Lifetime profit = product revenue − COGS, using cost-at-purchase for delivered items. (Earnings after subtracting cost of goods sold (COGS) from revenue for delivered items.)',
    margin: 'Profit margin = Profit ÷ Revenue (lifetime).',
    price: 'Current list price of the product (before discounts/coupons).',
    cost: 'Cost price used for COGS calculations, captured at purchase time in orders.',
  },
  dashboard: {
    revenueThisMonth: 'Total money collected from delivered orders in the selected month.',
    categoryRevenue30d: 'Delivered revenue grouped by product category over the last 30 days.',
  },
  financeHeaders: {
    month: 'Month of the year being summarized (e.g., 2025-03).',
    income:
      'Delivered revenue recognized in this month (total money collected for delivered orders).',
    cogs: 'Cost of goods sold for items delivered this month, using cost-at-purchase.',
    expenses: 'Operating expenses recorded in this month.',
    profit: 'Net profit for the month = Revenue − COGS − Expenses.',
  },
  orderHeaders: {
    profit: 'Earnings after subtracting COGS from revenue for delivered items in this order.',
    margin: 'Profit as a proportion of revenue for this order. Margin = Profit ÷ Revenue.',
    total: 'Order total = Subtotal − Discount + Shipping.',
    totalCost: 'Sum of item cost-at-purchase × quantity for this order (COGS).',
    discount: 'Total discount applied to this order from coupon(s).',
  },
} as const;
