import { useState } from 'react';
import { ViewSwitcher, NoDataFound, Divider } from '@baby-toys/ui-kit';
import { faHeart, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useLoginDialogStore } from '../../store/useLoginDialogStore';
import SmartProductCard from '../../components/features/SmartProductCard/SmartProductCard.tsx';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import { useMyWishlist } from '../../api/wishlistApi';
import { useTranslation } from 'react-i18next';

const LIST_PAGE_SIZE = 10;

const WishListPage = () => {
  const { isAuthenticated } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const { data, isLoading: loading } = useMyWishlist(
    page,
    LIST_PAGE_SIZE,
    'id',
    'DESC',
    isAuthenticated
  );
  const localItems = data?.items ?? [];
  const totalSize = data?.totalItems ?? 0;
  const handlePaginationChange = (newPage: number) => setPage(newPage);
  const isLoading = loading && !data?.items?.length;

  const renderContent = () => {
    if (!isAuthenticated && !isLoading) {
      return (
        <NoDataFound
          icon={faInbox}
          message={t('wishlist.loginPromptTitle')}
          subtext={t('wishlist.loginPromptSubtitle')}
          align="center"
          buttonText={t('wishlist.login')}
          onButtonClick={openLoginDialog}
        />
      );
    }

    if (localItems.length === 0 && !isLoading) {
      return (
        <NoDataFound
          icon={faHeart}
          message={t('wishlist.emptyTitle')}
          subtext={t('wishlist.emptySubtitle')}
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
        isStaticView
        isLoading={isLoading}
      />
    );
  };

  return (
    <PageContainer header={t('wishlist.header')}>
      {renderContent()}
      <Divider className="bts-marginTxxxxl" />
      <YouMayAlsoLikeSection mode="flex" />
    </PageContainer>
  );
};

export default WishListPage;
