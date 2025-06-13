export type Toy = {
  label?: string;
  imageSrc: string;
  name: string;
  price: string;
  rating: number;
  oldPrice?: string;
  isFavorite?: boolean;
};

export interface Feedback {
  rating: number;
  name: string;
  avatarUrl?: string;
  comment: string;
}
