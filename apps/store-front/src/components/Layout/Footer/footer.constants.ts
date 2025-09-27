import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

export const exploreLinks = [
  { label: 'Shop', path: '/shop' },
  { label: 'Wish List', path: '/wish-list' },
  { label: 'Contact Us', path: '/contact-us' },
  { label: 'Return Policy', path: '/policies?section=returnPolicy' },
  { label: 'Shipping Policy', path: '/policies?section=shippingPolicy' },
];

export const socialMediaLinks = [
  { icon: faFacebookF, url: '' },
  { icon: faTwitter, url: '' },
  { icon: faInstagram, url: '' },
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
