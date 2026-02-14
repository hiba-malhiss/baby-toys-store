import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createExpense,
  deleteExpense,
  listExpensesByMonth,
  type Expense,
} from '../../api/expensesApi';
import { useForm } from 'react-hook-form';
import { Button } from '@baby-toys/ui-kit';
import { Trash2 } from 'lucide-react';

export type FormValues = {
  date: Date | null;
  amount: string;
  category: string;
  description: string;
};

export function useExpensesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [yearMonth, setYearMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Dialog open state
  const [isOpen, setIsOpen] = useState(false);

  // Form state (moved from page)
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      date: null,
      amount: '',
      category: '',
      description: '',
    },
  });

  const { data, isLoading, refetch } = useQuery<Expense[]>({
    queryKey: ['expenses', yearMonth],
    queryFn: () => listExpensesByMonth(yearMonth),
  });

  const createMut = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', yearMonth] });
      queryClient.invalidateQueries({ queryKey: ['monthlyFinance'] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', yearMonth] });
      queryClient.invalidateQueries({ queryKey: ['monthlyFinance'] });
    },
  });

  useEffect(() => {
    refetch();
  }, [yearMonth, refetch]);

  const columns = useMemo(
    () => [
      { field: 'date', header: t('app.expenses.date') },
      { field: 'category', header: t('app.expenses.category') },
      { field: 'amount', header: t('app.expenses.amount') },
      { field: 'description', header: t('app.expenses.description') },
      {
        header: t('app.actions'),
        body: (row: any) => (
          <Button
            size="small"
            appearance="outline"
            leftIconComp={Trash2}
            onClick={() => deleteMut.mutateAsync(row.id)}
            aria-label={t('app.common.delete')}
          />
        ),
      },
    ],
    [deleteMut, t]
  );

  return {
    yearMonth,
    setYearMonth,
    expenses: data ?? [],
    isLoading,
    handleCreate: (payload: {
      date: string;
      amount: number;
      category?: string;
      description?: string;
    }) => createMut.mutateAsync(payload as Expense),
    handleDelete: (id: number) => deleteMut.mutateAsync(id),
    columns,
    // dialog state
    isOpen,
    setIsOpen,
    // form api
    control,
    handleSubmit,
    reset,
    isSubmitting,
  };
}
