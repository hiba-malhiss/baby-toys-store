import { useEffect, useState } from 'react';
import { ViewSwitcher, NoDataFound } from '@baby-toys/ui-kit/components';
import { mockFetchWishlist } from '@mock-data/useMockProductsApi';
import { faHeart, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useLoginDialogStore } from '../../store/useLoginDialogStore';
import SmartProductCard from '../../components/features/SmartProductCard/SmartProductCard.tsx';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';

const LIST_PAGE_SIZE = 3;

const WishListPage = () => {
  const { isLoggedIn } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();
  const { items, page, totalSize, loading, handlePaginationChange } = useHandlePagination(
    (page) => mockFetchWishlist(page, LIST_PAGE_SIZE),
    LIST_PAGE_SIZE
  );
  const { wishlist } = useWishlistStore();
  const [localItems, setLocalItems] = useState(items);

  // Sync with pagination (initial load)
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Sync with wishlist store-front live updates
  useEffect(() => {
    setLocalItems((prev) => {
      const filtered = prev.filter((item) => wishlist.some((p) => p.id === item.id));
      const missing = wishlist.filter((p) => !filtered.some((i) => i.id === p.id));
      return [...filtered, ...missing];
    });
  }, [wishlist]);

  const renderContent = () => {
    if (!isLoggedIn && !loading) {
      return (
        <NoDataFound
          icon={faInbox}
          message="It is empty here."
          subtext="Personalize your shopping experience with your Wishlist."
          align="center"
          buttonText="Login"
          onButtonClick={openLoginDialog}
        />
      );
    }

    if (localItems.length === 0 && !loading) {
      return (
        <NoDataFound
          icon={faHeart}
          message="Your wish list is empty"
          subtext="Store everything you love on one page."
          align="center"
          iconSize="xxxlarge"
        />
      );
    }

    return (
      <ViewSwitcher
        items={localItems.map((product, index) => (
          <SmartProductCard
            key={product.id || `product-${product.label}-${index}`}
            product={product}
          />
        ))}
        page={page}
        pageSize={LIST_PAGE_SIZE}
        totalSize={totalSize}
        onPaginationChange={handlePaginationChange}
        staticView="flex"
        isLoading={loading}
      />
    );
  };

  return (
    <PageContainer header="My Wish List">
      {renderContent()}
      <YouMayAlsoLikeSection mode="flex" />
    </PageContainer>
  );
};

export default WishListPage;
