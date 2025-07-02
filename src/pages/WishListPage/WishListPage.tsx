import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import Heading from '../../components/common/Heading/Heading.tsx';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher';
import { NoDataFound } from '../../components/common/NoDataFound';
import { mockFetchWishlist } from '../../mock-data/useMockProductsApi';
import { faHeart, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useLoginDialogStore } from '../../store/useLoginDialogStore';
import { useOfflinePagination } from '../../hooks/useOfflinePagination';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard.tsx';
import YouMayAlsoLikeSection from '../ShopPage/YouMayAlsoLikeSection';

const LIST_PAGE_SIZE = 3;

const WishListPage = () => {
  const { isLoggedIn } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();

  const { items, page, totalSize, loading, setPage } = useOfflinePagination(
    mockFetchWishlist,
    LIST_PAGE_SIZE
  );

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

    if (totalSize === 0 && !loading) {
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
        items={items.map((product, index) => (
          <SmartProductCard
            key={product.id || `product-${product.label}-${index}`}
            product={product}
          />
        ))}
        page={page}
        pageSize={LIST_PAGE_SIZE}
        totalSize={totalSize}
        onPaginationChange={setPage}
        staticView="flex"
        isLoading={loading}
      />
    );
  };

  return (
    <PageContainer>
      <Heading level="h1" className="bts-marginBxl bts-marginTxxxxl">
        My Wish List
      </Heading>
      {renderContent()}
      <YouMayAlsoLikeSection mode="flex" />
    </PageContainer>
  );
};

export default WishListPage;
