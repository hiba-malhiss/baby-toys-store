import { useQuery } from '@tanstack/react-query';
import { getMonthDetail, type MonthDetail } from '../../api/financeApi';

export function useMonthDetailPage(yearMonth: string) {
  const { data, isLoading } = useQuery<MonthDetail>({
    queryKey: ['monthDetail', yearMonth],
    queryFn: () => getMonthDetail(yearMonth),
    enabled: !!yearMonth,
  });

  return { data, isLoading };
}
