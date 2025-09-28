import { useAuth } from '../context/AuthContext';
import { useLoginDialogStore } from '../store/useLoginDialogStore';
import { useAddToWishlist, useRemoveFromWishlist } from '../api/wishlistApi';
import type { UiProduct } from '../api/normalizers/productNormalizer';
import { useToast } from '@baby-toys/ui-kit';

export function useWishlist(product: Pick<UiProduct, 'id' | 'isFavorite'>) {
  const { isAuthenticated } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();

  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const toast = useToast();

  const isFavorite = Boolean(product.isFavorite);
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
