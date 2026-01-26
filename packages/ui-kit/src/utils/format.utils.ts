export const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format an ISO date/time string into a localized medium-date, short-time string.
 * Falls back gracefully to raw input when parsing fails and to an em dash when empty.
 */
export const formatDateTime = (
  isoString: string | undefined | null,
  opts?: Intl.DateTimeFormatOptions
): string => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return String(isoString);
    const options: Intl.DateTimeFormatOptions = opts ?? { dateStyle: 'medium', timeStyle: 'short' };
    return d.toLocaleString(undefined, options);
  } catch {
    return String(isoString);
  }
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
