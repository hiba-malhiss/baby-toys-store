import { useAuth } from '../context/AuthContext';
import { useLoginDialogStore } from '../store/useLoginDialogStore';
import { useAddToWishlist, useRemoveFromWishlist } from '../api/wishlistApi';
import type { UiProduct } from '../api/normalizers/productNormalizer';
import { useToast } from '@baby-toys/ui-kit';
import { useWishlistIdsStore } from '../store/useWishlistIdsStore';

export function useWishlist(product: Pick<UiProduct, 'id'>) {
  const { isAuthenticated } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();

  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const toast = useToast();

  const has = useWishlistIdsStore((s) => s.has);
  const isFavorite = has(product.id as number);
  const isLoading = addMutation.isPending || removeMutation.isPending;

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to use your Wishlist.');
      openLoginDialog();
      return;
    }

    if (isFavorite) {
      await removeMutation.mutateAsync({ productId: product.id });
    } else {
      await addMutation.mutateAsync({ productId: product.id });
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
}
