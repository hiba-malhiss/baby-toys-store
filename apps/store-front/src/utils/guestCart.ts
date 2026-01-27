/**
 * Guest Cart Token Management
 *
 * Simple localStorage utilities for guest cart tokens.
 * Token fetching is now handled by React Query in guestTokenApi.ts
 */

const GUEST_CART_TOKEN_KEY = 'guestCartToken';
let memoryGuestCartToken: string | null = null;

function isStorageAvailable(): boolean {
  try {
    const testKey = '__guest_cart_token_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get guest cart token from localStorage (synchronous)
 */
export function getGuestCartToken(): string | null {
  if (!isStorageAvailable()) return memoryGuestCartToken;
  try {
    const token = localStorage.getItem(GUEST_CART_TOKEN_KEY);
    // Keep memory fallback in sync
    memoryGuestCartToken = token;
    return token;
  } catch {
    return memoryGuestCartToken;
  }
}

/**
 * Set guest cart token in localStorage
 */
export function setGuestCartToken(token: string): void {
  memoryGuestCartToken = token;
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
  } catch {
    // Swallow – fallback already updated
  }
}

/**
 * Clear guest cart token (used after login/merge)
 */
export function clearGuestCartToken(): void {
  memoryGuestCartToken = null;
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(GUEST_CART_TOKEN_KEY);
  } catch {
    // ignore
  }
}

/**
 * Check if guest cart token exists
 */
export function hasGuestCartToken(): boolean {
  return !!getGuestCartToken();
}
