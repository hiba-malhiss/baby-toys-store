import type { Product } from '../types/product.types';

// Mock data pools
const toyNames = [
  'Blocks Shape-Sorting Toy',
  'Stitch Medium Soft Toy',
  'Wooden Train Set',
  'Stacking Rings',
  'Puzzle Cubes',
  'Animal Figurines',
  'Toy Car Set',
  'Mini Kitchen Set',
  'Learning Laptop',
];

const brands = ['GUND', 'LEGO', 'Fisher-Price', 'Melissa & Doug', 'Hot Wheels'];
const materials = ['Plastic', 'Wood', 'Cotton', 'Metal', 'Rubber'];
const ageGroups = ['1-3 years', '3-5 years', '5-7 years', '7+ years'];
const dimensions = ['10 x 8 x 4 inches', '12 x 10 x 6 inches', '8 x 6 x 3 inches'];
const weights = ['0.5 lbs', '1.2 lbs', '0.8 lbs', '1.0 lbs'];

const totalImages = 9;

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomImages = (count = 4): string[] => {
  const set = new Set<string>();
  while (set.size < count) {
    const index = Math.floor(Math.random() * totalImages) + 1;
    set.add(`/assets/images/toys/img${index}.png`);
  }
  return Array.from(set);
};

// Main toy generator
const generateRandomToys = (count = 19): Product[] => {
  return Array.from({ length: count }, () => {
    const name = getRandom(toyNames);
    const galleryImages = getRandomImages();
    const basePrice = Math.random() * 30 + 10;
    const price = parseFloat(basePrice.toFixed(2));
    const hasDiscount = Math.random() < 0.5;
    const oldPrice = hasDiscount
      ? parseFloat((price + Math.random() * 10 + 5).toFixed(2))
      : undefined;
    const label = oldPrice ? 'SALE' : getRandom([undefined, 'NEW']);

    return {
      id: `${name.replace(/\s+/g, '-').toLowerCase()}`,
      name,
      mainImage: galleryImages[0],
      images: galleryImages,
      price,
      oldPrice,
      label,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      numberOfRatings: Math.floor(Math.random() * 1000),
      isFavorite: false,
      description:
        'Duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus.',
      featureBullets: [
        'Helps develop fine motor skills and problem-solving.Helps develop fine motor skills and problem-solving.',
        'Bright colors and durable materials for long-lasting play.Bright colors and durable materials for long-lasting play.',
        'Safe and educational — ideal for early learners.Safe and educational — ideal for early learners.',
        'Perfect gift for birthdays or holidays. Perfect gift for birthdays or holidays.',
        'Perfect gift for birthdays or holidays. Perfect gift for birthdays or holidays.',
        'Perfect gift for birthdays or holidays. Perfect gift for birthdays or holidays.',
      ],
      details: [
        { label: 'Brand Name', value: getRandom(brands) },
        { label: 'Material', value: getRandom(materials) },
        { label: 'Recommended Age', value: getRandom(ageGroups) },
        { label: 'Dimensions', value: getRandom(dimensions) },
        { label: 'Weight', value: getRandom(weights) },
      ],
    };
  });
};

// Generate and export toy list
export const toys: Product[] = generateRandomToys();

// Get a toy by ID
export const getProductById = (id: string): Product | undefined => {
  return toys.find((toy) => toy.id === id);
};
