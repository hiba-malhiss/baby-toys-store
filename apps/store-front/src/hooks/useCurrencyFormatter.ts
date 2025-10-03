import { useCallback } from 'react';
import { useStoreSettings } from '../api/settingsApi';

export const useCurrencyFormatter = (symbolOverride?: string) => {
  const { data: settings } = useStoreSettings();
  const symbol = symbolOverride ?? settings?.general?.currencySymbol ?? '';

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return useCallback(
    (amount: number): string => {
      const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
      return symbol ? `${symbol}${formatter.format(val)}` : formatter.format(val);
    },
    [symbol, formatter]
  );
};
