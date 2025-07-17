import { faHeadset, faTruckFast, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import type { Review, InfoCardType, Category, Product, RadioOption } from '../types/product.types';

// from product-details-page.ts
export const description =
  '        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut' +
  '              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation' +
  '              ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in' +
  '              reprehenderit \n \n in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' +
  '              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt' +
  '              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt' +
  '              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt' +
  '              mollit anim id est laborum.';

// from home-page.ts
export const photoShoots: string[] = [
  '/assets/images/recent-photo-shoots/pic1.png',
  '/assets/images/recent-photo-shoots/pic2.png',
  '/assets/images/recent-photo-shoots/pic3.png',
  '/assets/images/recent-photo-shoots/pic4.png',
];

export const reviews: Review[] = [
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
    avatarUrl: '/assets/kit-images/avatars/avatar3.png',
    comment: 'Fantastic experience! I’ll definitely order again.',
  },
  {
    rating: 4.2,
    name: 'Sophia Wilson',
    avatarUrl: '/assets/kit-images/avatars/avatar4.png',
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

export const unifiedCategories: Category[] = [
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

// from shop-page.ts
export const colorsRadioOptions: RadioOption[] = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Pink', value: 'pink' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
];

export const brandsRadioOptions: RadioOption[] = [
  { label: 'Lego', value: 'lego' },
  { label: 'Fisher-Price', value: 'fisher-price' },
  { label: 'VTech', value: 'vtech' },
  { label: 'Hasbro', value: 'hasbro' },
  { label: 'Mattel', value: 'mattel' },
  { label: 'Hot Wheels', value: 'hot-wheels' },
];

export const materialsRadioOptions: RadioOption[] = [
  { label: 'Plastic', value: 'plastic' },
  { label: 'Wood', value: 'wood' },
  { label: 'Metal', value: 'metal' },
  { label: 'Fabric', value: 'fabric' },
  { label: 'Rubber', value: 'rubber' },
  { label: 'Eco-Friendly', value: 'eco-friendly' },
];

export const DEFAULT_PRICE: [number, number] = [0, 300];

// from toy-card-list.ts
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
    const sales = Math.floor(seededRandom(seed * 17) * 500); // random sales between 0 and 499

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
      sales,
      label,
      rating: parseFloat((seededRandom(seed * 10) * 1.5 + 3.5).toFixed(1)),
      numberOfRatings: Math.floor(seededRandom(seed * 11) * 1000),
      isFavorite: false,
      availableInStock: Math.floor(seededRandom(seed * 12) * 20),
      shortDescription:
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
