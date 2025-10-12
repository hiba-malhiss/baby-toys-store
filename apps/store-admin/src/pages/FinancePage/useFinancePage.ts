import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyFinance, type MonthlyFinance } from '../../api/financeApi';

export function useFinancePage(){
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { data, isLoading, refetch } = useQuery<MonthlyFinance[]>({
    queryKey: ['monthlyFinance', year],
    queryFn: () => getMonthlyFinance(year),
  });

  useEffect(() => {
    refetch();
  }, [year, refetch]);

  return {
    year,
    setYear,
    data: data ?? [],
    isLoading,
  };
}
