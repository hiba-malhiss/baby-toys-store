import { OrderItem } from '@baby-toys/types/src';
import { toys } from './mock-data';

export const mockOrders: OrderItem[] = [
  {
    id: 1,
    email: 'guest-1@example.com',
    date: '2023-10-26T10:00:00Z',
    cartItems: [
      { quantity: 1, id: 'cart-1', dateAdded: Date.now(), product: toys[0] },
      { quantity: 2, id: 'cart-2', dateAdded: Date.now(), product: toys[1] },
    ],
    subtotal: toys[0].price + toys[1].price * 2,
    shippingCost: 10,
    total: toys[0].price + toys[1].price * 2 + 10,
    shippingInfo: {
      name: 'John Doe',
      address: '123 Main St',
      phone: '555-1234',
    },
    status: 'pending',
  },
  {
    id: 2,
    email: 'user@example.com',
    date: '2023-10-25T15:30:00Z',
    cartItems: [{ quantity: 1, id: 'cart-3', dateAdded: Date.now(), product: toys[2] }],
    subtotal: toys[2].price,
    shippingCost: 5,
    total: toys[2].price + 5,
    shippingInfo: {
      name: 'Jane Smith',
      address: '456 Oak Ave',
      phone: '555-5678',
    },
    status: 'shipped',
  },
];
