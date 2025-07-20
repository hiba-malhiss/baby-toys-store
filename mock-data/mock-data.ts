import { faHeadset, faTruckFast, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import type { Review, InfoCardType, Category, Product } from '../types/product.types';
import { Brand, Color, Material } from '@baby-toys/types/src';

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
    avatarUrl: '',
    comment: 'so beautiful !!!',
    date: '2025-07-13T20:47:49.568Z',
    id: 'toy-1-user@example.com-1752439669568',
    name: 'Mock User',
    orderId: 1752439560617,
    productId: 'toy-1',
    rating: 4,
    userEmail: 'user@example.com',
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
  { name: 'Play sets', id: 'play-sets', image: '/assets/icons/play-sets.svg' },
  { name: 'Control Toys', id: 'control-toys', image: '/assets/icons/control-toys.svg' },
  {
    name: 'Educational Toys',
    id: 'educational-toys',
    image: '/assets/icons/educational-toys.svg',
  },
  {
    name: 'Eco-Friendly Toys',
    id: 'eco-friendly-toys',
    image: '/assets/icons/eco-friendly.svg',
  },
  { name: 'Stuffed Toys', id: 'stuffed-toys', image: '/assets/icons/stuffed-toys.svg' },
];

// Brands mock data
export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Lego',
    logo: '/brands/lego.png',
    description: 'Building blocks and construction toys',
    website: 'https://www.lego.com',
  },
  {
    id: '2',
    name: 'Fisher-Price',
    logo: '/brands/fisher-price.png',
    description: 'Early childhood learning toys',
    website: 'https://www.fisher-price.com',
  },
  {
    id: '3',
    name: 'Melissa & Doug',
    logo: '/brands/melissa-doug.png',
    description: 'Wooden educational toys',
    website: 'https://www.melissaanddoug.com',
  },
];

// Colors mock data
export const mockColors: Color[] = [
  { id: '1', name: 'Red', code: '#FF0000' },
  { id: '2', name: 'Blue', code: '#0000FF' },
  { id: '3', name: 'Green', code: '#00FF00' },
  { id: '4', name: 'Yellow', code: '#FFFF00' },
  { id: '5', name: 'Black', code: '#000000' },
  { id: '6', name: 'White', code: '#FFFFFF' },
];

// Materials mock data
export const mockMaterials: Material[] = [
  { id: '1', name: 'Plastic', description: 'Durable and lightweight material' },
  { id: '2', name: 'Wood', description: 'Natural and eco-friendly material' },
  { id: '3', name: 'Fabric', description: 'Soft and safe for all ages' },
  { id: '4', name: 'Metal', description: 'Sturdy and long-lasting' },
];

// from shop-page.ts
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

    // Generate a unique ID for each product
    const id = `toy-${index + 1}`;

    // Select random references
    const brandId = getSeededRandom(mockBrands, seed * 6)?.id || '';
    const categoryId = getSeededRandom(unifiedCategories, seed * 7)?.id || '';

    // Select 1-2 random materials
    const materialCount = Math.max(1, Math.floor(seededRandom(seed * 8) * 2));
    const materialIds = Array.from(
      { length: materialCount },
      (_, i) =>
        mockMaterials[Math.floor(seededRandom(seed * (9 + i)) * mockMaterials.length)]?.id || ''
    ).filter(Boolean);

    // Select 1 random color
    const colorId = mockColors[Math.floor(seededRandom(seed * 12) * mockColors.length)]?.id || '';

    const brand = mockBrands.find((b) => b.id === brandId);
    const category = unifiedCategories.find((c) => c.id === categoryId);
    const materialsList = materialIds
      .map((id) => mockMaterials.find((m) => m.id === id)?.name)
      .filter(Boolean);
    const colorName = mockColors.find((c) => c.id === colorId)?.name || '';

    return {
      id,
      name,
      price,
      oldPrice,
      label,
      rating: parseFloat((3 + seededRandom(seed * 20) * 2).toFixed(1)), // 3.0-5.0
      numberOfRatings: Math.floor(seededRandom(seed * 21) * 500), // 0-500
      description:
        `${name} is a wonderful toy that provides hours of fun and learning. ` +
        `Suitable for ${getSeededRandom(ageGroups, seed * 22)}. ` +
        `Dimensions: ${getSeededRandom(dimensions, seed * 23)}. ` +
        `Weight: ${getSeededRandom(weights, seed * 24)}.`,
      shortDescription: `Perfect for ${getSeededRandom(ageGroups, seed * 25)}. ${getSeededRandom(dimensions, seed * 26)}.`,
      featureBullets: [
        `Suitable for ${getSeededRandom(ageGroups, seed * 27)}`,
        materialsList.length > 0 ? `Made of ${materialsList.join(', ')}` : 'High-quality materials',
        'Encourages creativity and learning',
        'Safe and durable construction',
        'Bright colors and durable materials for long-lasting play.',
        'Perfect gift for birthdays or holidays.',
      ],
      details: [
        { label: 'Brand', value: brand?.name || '' },
        { label: 'Material', value: materialsList.join(', ') || 'Various' },
        { label: 'Color', value: colorName || 'N/A' },
        { label: 'Age Range', value: getSeededRandom(ageGroups, seed * 30) },
        { label: 'Category', value: category?.name || 'Toys' },
      ],
      categoryId,
      brandId,
      materialIds,
      colorId,
      mainImage: galleryImages[0],
      images: galleryImages,
      availableInStock: Math.floor(seededRandom(seed * 35) * 100), // 0-100
      sales,
      releaseDate: new Date(
        Date.now() - Math.floor(seededRandom(seed * 36) * 1000 * 60 * 60 * 24 * 365 * 2)
      ) // Within last 2 years
        .toISOString()
        .split('T')[0],
      isFavorite: false,
    };
  });
};

// Generate and export toy list
export const toys: Product[] = generateRandomToys();
