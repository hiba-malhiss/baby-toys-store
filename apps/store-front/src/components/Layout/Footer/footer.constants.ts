import { Facebook, MessageCircle } from 'lucide-react';
import type { ComponentType } from 'react';
import type { SharePlatform } from '../../../utils/share';

export const exploreLinks = [
  { label: 'Shop', path: '/shop' },
  { label: 'Wish List', path: '/wish-list' },
  { label: 'Contact Us', path: '/contact-us' },
  { label: 'Return Policy', path: '/policies?section=returnPolicy' },
  { label: 'Shipping Policy', path: '/policies?section=shippingPolicy' },
];

export const socialMediaLinks: Array<{ icon: ComponentType<any>; platform: SharePlatform }> = [
  { icon: Facebook, platform: 'facebook' },
  { icon: MessageCircle, platform: 'whatsapp' },
];

// UI config for each ID
export const footerInfoConfig: Record<
  string,
  { label?: string; isLink?: boolean; appearance?: string; link?: string }
> = {
  'work-days': {},
  'work-times': {},
  phone: {
    label: 'Call us: ',
    isLink: true,
    link: '',
    appearance: 'highlighted',
  },
  email: {
    label: 'Email us: ',
    isLink: true,
    link: '',
    appearance: 'highlighted',
  },
};

export const linkPrefixes: Record<string, string> = {
  phone: 'tel:',
  email: 'mailto:',
};
