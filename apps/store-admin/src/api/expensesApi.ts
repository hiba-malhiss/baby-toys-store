import api from './axiosConfig';

export type Expense = {
  id?: number;
  date: string; // YYYY-MM-DD
  amount: number;
  category?: string;
  description?: string;
};

export async function listExpensesByMonth(yearMonth: string): Promise<Expense[]> {
  const { data } = await api.get(`/api/admin/expenses/month/${yearMonth}`);
  return data;
}

export async function listExpenses(from?: string, to?: string, page = 0, size = 20) {
  const { data } = await api.get(`/api/admin/expenses`, { params: { from, to, page, size } });
  return data;
}

export async function createExpense(payload: Expense): Promise<Expense> {
  const { data } = await api.post(`/api/admin/expenses`, payload);
  return data;
}

export async function deleteExpense(id: number): Promise<void> {
  await api.delete(`/api/admin/expenses/${id}`);
}
