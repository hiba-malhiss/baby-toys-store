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
const categories = ['Blocks', 'Plush', 'Vehicles', 'Educational', 'Pretend Play'];
const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Multi'];

const totalImages = 9;

// Seeded random function for consistent results
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getSeededRandom = <T>(arr: T[], seed: number): T => {
  const index = Math.floor(seededRandom(seed) * arr.length);
  return arr[index];
};

const getSeededRandomImages = (seed: number, count = 4): string[] => {
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(seededRandom(seed + i) * totalImages) + 1;
    images.push(`/assets/images/toys/img${index}.png`);
  }
  // Remove duplicates while maintaining order
  return [...new Set(images)];
};

// Main toy generator with consistent IDs
const generateRandomToys = (count = 19): Product[] => {
  return Array.from({ length: count }, (_, index) => {
    // Use index as seed for consistent results
    const seed = index + 1;

    const name = getSeededRandom(toyNames, seed);
    const galleryImages = getSeededRandomImages(seed, 4);
    const basePrice = seededRandom(seed * 2) * 30 + 10;
    const price = parseFloat(basePrice.toFixed(2));
    const hasDiscount = seededRandom(seed * 3) < 0.5;
    const oldPrice = hasDiscount
      ? parseFloat((price + seededRandom(seed * 4) * 10 + 5).toFixed(2))
      : undefined;
    const labelRandom = seededRandom(seed * 5);
    const label = oldPrice ? 'SALE' : labelRandom < 0.3 ? 'NEW' : undefined;

    // Create consistent ID based on index
    const id = `toy-${index + 1}`;

    // Assign all required top-level fields
    return {
      id,
      name,
      category: getSeededRandom(categories, seed * 6),
      brand: getSeededRandom(brands, seed * 7),
      color: getSeededRandom(colors, seed * 8),
      material: getSeededRandom(materials, seed * 9),
      mainImage: galleryImages[0],
      images: galleryImages,
      price,
      oldPrice,
      label,
      rating: parseFloat((seededRandom(seed * 10) * 1.5 + 3.5).toFixed(1)),
      numberOfRatings: Math.floor(seededRandom(seed * 11) * 1000),
      isFavorite: false,
      availableInStock: Math.floor(seededRandom(seed * 12) * 20),
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
        { label: 'Brand Name', value: getSeededRandom(brands, seed * 12) },
        { label: 'Material', value: getSeededRandom(materials, seed * 13) },
        { label: 'Recommended Age', value: getSeededRandom(ageGroups, seed * 14) },
        { label: 'Dimensions', value: getSeededRandom(dimensions, seed * 15) },
        { label: 'Weight', value: getSeededRandom(weights, seed * 16) },
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
