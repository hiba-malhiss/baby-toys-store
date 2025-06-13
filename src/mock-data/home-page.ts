import { faHeadset, faTruckFast, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import type { Feedback, InfoCardType } from '../types/toy.types.ts';

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
    content: 'Free shipping for $150 and up',
  },
  {
    appearance: 'success',
    icon: faArrowRotateLeft,
    title: 'Return',
    content: 'Within 7 Days',
  },
];
