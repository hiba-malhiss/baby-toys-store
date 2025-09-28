import type { Query } from '@tanstack/react-query';

// Central place to manage query keys used across the product graph and auth-derived data
export const ROOT_KEYS = {
  profile: 'profile',
  products: 'products',
  productById: 'productById',
  relatedProducts: 'relatedProducts',
  highlights: 'highlights',
  myWishlist: 'myWishlist',
  wishlistCount: 'wishlistCount',
  topPicks: 'topPicks',
} as const;

export type RootKey = (typeof ROOT_KEYS)[keyof typeof ROOT_KEYS];

export function keyStartsWith(q: Query, root: RootKey) {
  const k = q.queryKey as unknown as any[];
  return Array.isArray(k) && k[0] === root;
}
