import { faHeadset, faTruckFast, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import type { Feedback, InfoCardType } from '../types/product.types.ts';
import type { RadioOption } from '../components/common/RadioButtonGroup/RadioButtonGroup.tsx';

export const photoShoots: string[] = [
  '/assets/images/recent-photo-shoots/pic1.png',
  '/assets/images/recent-photo-shoots/pic2.png',
  '/assets/images/recent-photo-shoots/pic3.png',
  '/assets/images/recent-photo-shoots/pic4.png',
];

export const feedbacks: Feedback[] = [
  {
    rating: 5,
    name: 'Emily Johnson',
    avatarUrl: '/assets/images/avatars/avatar.png',
    comment: 'My kids love the toys! Great quality and fast shipping.',
  },
  {
    rating: 4.5,
    name: 'Liam Smith',
    avatarUrl: '/assets/images/avatars/avatar2.png',
    comment: 'Good variety and reasonable prices.',
  },
  {
    rating: 4,
    name: 'Ava Brown',
    comment: 'Nice packaging and friendly customer service.',
  },
  {
    rating: 5,
    name: 'Noah Davis',
    avatarUrl: '/assets/images/avatars/avatar3.png',
    comment: 'Fantastic experience! I’ll definitely order again.',
  },
  {
    rating: 4.2,
    name: 'Sophia Wilson',
    avatarUrl: '/assets/images/avatars/avatar4.png',
    comment: 'The website is easy to navigate and delivery was quick.',
  },
];

export const infoCards: InfoCardType[] = [
  {
    appearance: 'info',
    icon: faHeadset,
    title: 'Customer Care',
    content: '24h hour follow up',
  },
  {
    appearance: 'warning',
    icon: faTruckFast,
    title: 'Free Shipping',
    // content will be injected from UI with currency symbol
    content: '',
  },
  {
    appearance: 'success',
    icon: faArrowRotateLeft,
    title: 'Return',
    content: 'Within 7 Days',
  },
];

// same as SortOptions values
export const topPicksRadioOptions: RadioOption[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Best seller', value: 'best_seller' },
  { label: 'New arrivals', value: 'new_arrivals' },
];

export interface UnifiedCategory {
  label: string;
  value: string;
  image: string | null;
}

export const unifiedCategories: UnifiedCategory[] = [
  { label: 'Play sets', value: 'play-sets', image: '/assets/icons/play-sets.svg' },
  { label: 'Control Toys', value: 'control-toys', image: '/assets/icons/control-toys.svg' },
  {
    label: 'Educational Toys',
    value: 'educational-toys',
    image: '/assets/icons/educational-toys.svg',
  },
  {
    label: 'Eco-Friendly Toys',
    value: 'eco-friendly-toys',
    image: '/assets/icons/eco-friendly.svg',
  },
  { label: 'Stuffed Toys', value: 'stuffed-toys', image: '/assets/icons/stuffed-toys.svg' },
];
