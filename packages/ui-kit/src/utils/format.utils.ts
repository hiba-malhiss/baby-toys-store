export const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatNumber = (value: number | undefined | null, currency?: string): string => {
  if (value === undefined || value === null) return '-';

  const formatter = new Intl.NumberFormat(
    undefined,
    currency
      ? {
          style: 'currency',
          currency,
          minimumFractionDigits: 2,
        }
      : {
          maximumFractionDigits: 0,
        }
  );

  return formatter.format(value);
};
