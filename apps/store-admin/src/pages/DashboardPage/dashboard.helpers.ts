export const toISO = (d: Date) => d.toISOString().slice(0, 10);

export const addDaysISO = (isoDate: string, days: number): string => {
  const d = new Date(isoDate + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
};

export const formatMoney = (value: number, currencySymbol: string): string =>
  `${currencySymbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export const formatAbbrevMoney = (value: number, currencySymbol: string): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${currencySymbol}${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${currencySymbol}${(value / 1_000).toFixed(1)}k`;
  return `${currencySymbol}${value.toFixed(0)}`;
};

export const buildComparisonSubtitle = (
  labels: string[] | undefined,
  shiftDays = 30
): { currentStart?: string; currentEnd?: string; prevStart?: string; prevEnd?: string } => {
  if (!labels || labels.length === 0) return {};
  const currentStart = labels[0];
  const currentEnd = labels[labels.length - 1];
  const prevStart = addDaysISO(currentStart, -shiftDays);
  const prevEnd = addDaysISO(currentEnd, -shiftDays);
  return { currentStart, currentEnd, prevStart, prevEnd };
};
