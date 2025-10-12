import api from './axiosConfig';

export type MonthlyFinance = {
  month: string; // YYYY-MM
  income: string | number;
  cogs: string | number;
  expenses: string | number;
  profit: string | number;
};

export type OrderBrief = {
  id: number;
  orderNumber: string;
  status: string;
  deliveredAt: string;
  total: number | string;
};

export type ExpenseBrief = {
  id: number;
  date: string; // YYYY-MM-DD
  category?: string;
  description?: string;
  amount: number | string;
};

export type MonthlySummary = {
  month: string; // YYYY-MM
  income: number | string;
  cogs: number | string;
  expenses: number | string;
  profit: number | string;
  ordersCount: number;
};

export type MonthDetail = {
  month: string; // YYYY-MM
  summary: MonthlySummary;
  orders: OrderBrief[];
  expenses: ExpenseBrief[];
};

export async function getMonthlyFinance(year: number): Promise<MonthlyFinance[]> {
  const { data } = await api.get(`/api/admin/finance/monthly`, { params: { year } });
  return data;
}

export async function getMonthDetail(yearMonth: string): Promise<MonthDetail> {
  const { data } = await api.get(`/api/admin/finance/months/${yearMonth}`);
  return data;
}
