import type { Toy } from '../types/toy.types.ts';

const toyNames = [
  'Blocks shape-sorting Toy',
  'Stitch Medium Soft Toy',
  'Wooden Train Set',
  'Stacking Rings',
  'Puzzle Cubes',
  'Animal Figurines',
  'Toy Car Set',
  'Mini Kitchen Set',
  'Learning Laptop',
];

const getRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomToys = (count = 19): Toy[] => {
  return Array.from({ length: count }, (_) => {
    const basePrice = Math.random() * 30 + 10;
    const price = parseFloat(basePrice.toFixed(2));
    const hasDiscount = Math.random() < 0.5;
    const oldPrice = hasDiscount ? `$${(price + Math.random() * 10 + 5).toFixed(2)}` : undefined;
    const label = oldPrice ? 'SALE' : getRandom([undefined, 'NEW']);

    return {
      label,
      imageSrc: `/assets/images/toys/img${Math.floor(Math.random() * 9) + 1}.png`,
      name: getRandom(toyNames),
      price: `$${price}`,
      oldPrice,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // between 3.5–5.0
      isFavorite: false,
      description:
        'Duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus',
    };
  });
};

export const toys = generateRandomToys();
