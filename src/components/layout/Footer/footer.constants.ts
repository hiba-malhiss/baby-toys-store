import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

export const exploreLinks = [
  { label: 'Shop', path: '/shop' },
  { label: 'Wish List', path: '/wish-list' },
  { label: 'Contact Us', path: '/contact-us' },
  { label: 'Return Policy', path: '/return-policy' },
  { label: 'Shipping Policy', path: '/shipping-policy' },
];

export const socialMediaLinks = [
  { icon: faFacebookF, url: '' },
  { icon: faTwitter, url: '' },
  { icon: faInstagram, url: '' },
];

export const customerServiceInfo = [
  'Monday to Friday',
  '10am - 6pm (Palestine time)',
  { label: 'Call us:', value: '123-456-7868', link: 'tel:1234567868' },
  { label: 'Email us:', value: 'info@example.com', link: 'mailto:info@example.com' },
];
