import React, { useState } from 'react';
import { ViewSwitcher, NoDataFound, Divider } from '@baby-toys/ui-kit';
import { faHeart, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useLoginDialogStore } from '../../store/useLoginDialogStore';
import SmartProductCard from '../../components/features/SmartProductCard/SmartProductCard.tsx';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { useMyWishlist } from '../../api/wishlistApi';

const LIST_PAGE_SIZE = 10;

const WishListPage = () => {
  const { isAuthenticated } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyWishlist(page, LIST_PAGE_SIZE, 'id', 'DESC', isAuthenticated);
  const localItems = data?.items ?? [];
  const totalSize = data?.totalItems ?? 0;
  const handlePaginationChange = (newPage: number) => setPage(newPage);

  const renderContent = () => {
    if (!isAuthenticated && !isLoading) {
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

    if (localItems.length === 0 && !isLoading) {
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
        isLoading={isLoading}
      />
    );
  };

  return (
    <PageContainer header="My Wish List">
      {renderContent()}
      <Divider />
      <YouMayAlsoLikeSection mode="flex" />
    </PageContainer>
  );
};

export default WishListPage;
