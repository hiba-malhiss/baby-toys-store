import { Home } from 'lucide-react';
import type { BreadcrumbItemData } from '@baby-toys/ui-kit/src/components';

export const baseBreadcrumbs: Record<string, BreadcrumbItemData[]> = {
  '/shop': [
    { icon: Home, path: '/' },
    { label: 'Shop', path: '/shop' },
  ],
  '/shop/toys': [
    { icon: Home, path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Toys', path: '/shop/toys' },
  ],
  '/product-details/:id': [
    { icon: Home, path: '/' },
    { label: 'Shop', path: '/shop' },
  ],
  '/shopping-cart': [
    { icon: Home, path: '/' },
    { label: 'Your shopping cart', path: '/shopping-cart' },
  ],
};
