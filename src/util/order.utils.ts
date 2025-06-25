import type { CartItem, Product } from '../types/product.types.ts';

export const calculateOrderSummary = (items: CartItem[], shipping: number) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  const total = subtotal + shipping;

  return { subtotal: subtotal.toFixed(2), total: total.toFixed(2) };
};

export const getProductItem = (product: Product, quantity: number = 1): CartItem => {
  return {
    productId: product.id,
    mainImage: product.mainImage,
    name: product.name,
    price: product.price,
    quantity: quantity || 1,
  };
};
