import { useState } from 'react';
import { ViewSwitcher, NoDataFound, Divider } from '@baby-toys/ui-kit';
import { faHeart, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useLoginDialogStore } from '../../store/useLoginDialogStore';
import SmartProductCard from '../../components/features/SmartProductCard/SmartProductCard.tsx';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import { useMyWishlist } from '../../api/wishlistApi';
import WishlistControlBar from '../../components/features/WishlistControlBar/WishlistControlBar';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../api/catalogApi.ts';

const LIST_PAGE_SIZE = 10;

const WishListPage = () => {
  const { isAuthenticated } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [stock, setStock] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  const { data: categories = [] } = useCategories();

  const { data, isLoading: loading } = useMyWishlist(
    page,
    LIST_PAGE_SIZE,
    sortBy,
    sortDirection,
    categoryId,
    stock
  );
  const localItems = data?.items ?? [];
  const totalSize = data?.totalItems ?? 0;
  const handlePaginationChange = (newPage: number) => setPage(newPage);
  const isLoading = loading && !data?.items?.length;

  const handleReset = () => {
    setCategoryId(null);
    setStock('ALL');
    setSortBy('id');
    setSortDirection('DESC');
    setPage(1);
  };

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
    <PageContainer header={`${t('wishlist.header')} (${totalSize})`}>
      <WishlistControlBar
        value={{ sortBy, sortDirection, categoryId, stock }}
        categories={categories}
        onChange={(next) => {
          setSortBy(next.sortBy);
          setSortDirection(next.sortDirection);
          setCategoryId(next.categoryId);
          setStock(next.stock);
          setPage(1);
        }}
        onReset={handleReset}
      />
      {renderContent()}
      <Divider className="bts-marginTxxxxl" />
      <YouMayAlsoLikeSection mode="flex" />
    </PageContainer>
  );
};

export default WishListPage;
