import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type Toy = {
  label?: string;
  imageSrc: string;
  name: string;
  price: string;
  rating: number;
  oldPrice?: string;
  description?: string;
  isFavorite?: boolean;
};

export interface Feedback {
  rating: number;
  name: string;
  avatarUrl?: string;
  comment: string;
}

export type InfoCardType = {
  appearance?: 'info' | 'warning' | 'success';
  icon: IconDefinition;
  title: string;
  content: string;
};

export type ToyCategory = {
  label: string;
  image: string;
};

export type RadioOption = {
  label: string;
  value: string;
};
