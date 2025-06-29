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
 * Add or update item in cart
 */
export const addOrUpdateCartItem = (
  items: CartItem[],
  product: Product,
  quantity: number = 1
): CartItem[] => {
  const existingItemIndex = items.findIndex((item) => item.productId === product.id);
  const newItem = getProductItem(product, quantity);

  if (existingItemIndex >= 0) {
    // Update existing item
    const updatedItems = [...items];
    updatedItems[existingItemIndex] = newItem;
    return updatedItems;
  } else {
    // Add new item
    return [...items, newItem];
  }
};
