import type { RadioOption } from '@baby-toys/ui-kit';

export const DEFAULT_SORT_OPTION = 'rating';

export const SORT_OPTIONS = [
  { label: 'Featured', value: DEFAULT_SORT_OPTION },
  { label: 'Best Seller', value: 'sales' },
  { label: 'New Arrivals', value: 'createdAt' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

export const TOP_PICS_SORT_OPTIONS: RadioOption[] = [
  { label: 'Featured', value: DEFAULT_SORT_OPTION },
  { label: 'Best seller', value: 'sales' },
  { label: 'New arrivals', value: 'createdAt' },
];
