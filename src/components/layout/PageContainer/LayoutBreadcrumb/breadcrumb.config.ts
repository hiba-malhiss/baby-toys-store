import { faHome } from '@fortawesome/free-solid-svg-icons';
import type { BreadcrumbItemData } from '../../../common/Breadcrumb/BreadcrumbItem.tsx';

export const baseBreadcrumbs: Record<string, BreadcrumbItemData[]> = {
  '/shop': [
    { icon: faHome, path: '/' },
    { label: 'Shop', path: '/shop' },
  ],
  '/shop/toys': [
    { icon: faHome, path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Toys', path: '/shop/toys' },
  ],
  '/product-details/:id': [
    { icon: faHome, path: '/' },
    { label: 'Shop', path: '/shop' },
  ],
};
