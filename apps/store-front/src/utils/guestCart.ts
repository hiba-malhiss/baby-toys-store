/**
 * Guest Cart Token Management
 *
 * Simple localStorage utilities for guest cart tokens.
 * Token fetching is now handled by React Query in guestTokenApi.ts
 */

const GUEST_CART_TOKEN_KEY = 'guestCartToken';

/**
 * Get guest cart token from localStorage (synchronous)
 */
export function getGuestCartToken(): string | null {
  return localStorage.getItem(GUEST_CART_TOKEN_KEY);
}

/**
 * Set guest cart token in localStorage
 */
export function setGuestCartToken(token: string): void {
  localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
}

/**
 * Clear guest cart token (used after login/merge)
 */
export function clearGuestCartToken(): void {
  localStorage.removeItem(GUEST_CART_TOKEN_KEY);
}

/**
 * Check if guest cart token exists
 */
export function hasGuestCartToken(): boolean {
  return !!localStorage.getItem(GUEST_CART_TOKEN_KEY);
}
