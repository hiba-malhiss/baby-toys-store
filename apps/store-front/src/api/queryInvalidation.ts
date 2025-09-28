import type { QueryClient } from '@tanstack/react-query';
import { ROOT_KEYS, keyStartsWith } from './queryKeys';

const authSensitiveRoots = [
  ROOT_KEYS.myWishlist,
  ROOT_KEYS.wishlistCount,
  ROOT_KEYS.products,
  ROOT_KEYS.productById,
  ROOT_KEYS.relatedProducts,
  ROOT_KEYS.highlights,
  ROOT_KEYS.topPicks,
] as const;

function invalidateRoots(qc: QueryClient, roots = authSensitiveRoots) {
  for (const root of roots) {
    // wishlistCount is a single key, others can have nested keys
    if (root === ROOT_KEYS.wishlistCount) {
      qc.invalidateQueries({ queryKey: [root] });
    } else {
      qc.invalidateQueries({ predicate: (q) => keyStartsWith(q, root) });
    }
  }
}

function refetchRoots(qc: QueryClient, roots = authSensitiveRoots) {
  for (const root of roots) {
    if (root === ROOT_KEYS.wishlistCount) {
      qc.refetchQueries({ queryKey: [root] });
    } else {
      qc.refetchQueries({ predicate: (q) => keyStartsWith(q, root) });
    }
  }
}

// Invalidate everything that changes after login
export function invalidateAfterAuthenticated(qc: QueryClient) {
  invalidateRoots(qc);
}

// Immediately refetch everything that depends on auth
export function refetchAfterAuthenticated(qc: QueryClient) {
  refetchRoots(qc);
}

// Invalidate queries affected when a user toggles wishlist
export function invalidateAfterWishlistToggle(qc: QueryClient, productId?: number) {
  if (productId != null) {
    qc.invalidateQueries({ queryKey: [ROOT_KEYS.productById, productId] });
  }
  invalidateRoots(qc);
}
