import type { CartItem, Product } from '../types/product.types.ts';

/**
 * Calculate order summary with proper type checking and validation
 */
export const calculateOrderSummary = (
  items: CartItem[],
  shipping: { cost: number; freeThreshold: number }
) => {
  // Validate inputs
  if (!Array.isArray(items)) {
    console.warn('calculateOrderSummary: items must be an array');
    return { subtotal: '0.00', total: '0.00', shipping: '0.00' };
  }

  // Calculate subtotal
  const subtotal = items.reduce((acc, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  // Handle shipping cost
  let shippingCost = 0;
  if (shipping) {
    // Apply free shipping logic
    const threshold = shipping.freeThreshold || 0;
    shippingCost = subtotal >= threshold ? 0 : shipping.cost;
  }

  const total = subtotal + shippingCost;

  return {
    subtotal: subtotal.toFixed(2),
    total: total.toFixed(2),
    shipping: shippingCost.toFixed(2),
    isFreeShipping: shippingCost === 0 && subtotal > 0,
  };
};

/**
 * Convert product to cart item
 */
export const getProductItem = (product: Product, quantity: number = 1): CartItem => {
  return {
    productId: product.id,
    mainImage: product.mainImage,
    name: product.name,
    price: product.price,
    quantity: Math.max(quantity || 1, 1), // Ensure minimum quantity of 1
  };
};

/**
 * Calculate total items in cart
 */
export const getTotalCartItems = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

/**
 * Update cart item quantity with validation
 */
export const updateCartItemQuantity = (
  items: CartItem[],
  productId: string,
  quantity: number
): CartItem[] => {
  const validQuantity = Math.max(parseInt(String(quantity)) || 1, 1);

  return items.map((item) =>
    item.productId === productId ? { ...item, quantity: validQuantity } : item
  );
};

/**
 * Check if an object is a CartItem
 */
const isCartItem = (item: any): item is CartItem => {
  return (
    item && 
    typeof item === 'object' && 
    'productId' in item && 
    'quantity' in item &&
    'name' in item &&
    'price' in item &&
    'mainImage' in item
  );
};

/**
 * Convert CartItem to Product-like object for cart operations
 */
const cartItemToProduct = (cartItem: CartItem): Product => {
  return {
    id: cartItem.productId,
    name: cartItem.name,
    mainImage: cartItem.mainImage,
    price: cartItem.price,
    // Add default values for required Product fields
    category: '',
    brand: '',
    color: '',
    material: '',
    images: [cartItem.mainImage],
    rating: 0,
    numberOfRatings: 0,
  };
};

/**
 * Add or update item in cart
 */
export const addOrUpdateCartItem = (
  items: CartItem[],
  product: Product | CartItem,
  quantity: number = 1
): CartItem[] => {
  // Validate input
  if (!product) {
    console.error('addOrUpdateCartItem: product is null or undefined');
    return items;
  }

  // Convert CartItem to Product if needed
  const productToAdd = isCartItem(product) ? cartItemToProduct(product) : product;
  const quantityToAdd = isCartItem(product) ? product.quantity : quantity;
  
  const existingItemIndex = items.findIndex((item) => item.productId === productToAdd.id);

  if (existingItemIndex >= 0) {
    // Update existing item by adding to the current quantity
    const updatedItems = [...items];
    const existingItem = updatedItems[existingItemIndex];
    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: existingItem.quantity + quantityToAdd,
    };
    return updatedItems;
  } else {
    // Add new item
    const newItem = getProductItem(productToAdd, quantityToAdd);
    return [...items, newItem];
  }
};
