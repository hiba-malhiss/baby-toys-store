import { useState, useEffect } from 'react';
import styles from './shop-page.module.scss';
import { type ViewMode, ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { PageContainer } from '../../components/shared/PageContainer/PageContainer.tsx';
import SmartProductCard from '../../components/shared/SmartProductCard/SmartProductCard.tsx';
import { SideFilters } from './SideFilters/SideFilters.tsx';
import { getProductCategories, useMockProductsApi } from '../../mock-data/useMockProductsApi.ts';
import { SHOP_PAGE_SIZE } from '../../constants/display.constants.ts';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';
import type { ShopFilters } from './SideFilters/side-filters.utils.ts';
import { SortProductsWithUrl } from './SortProductsWithUrl.tsx';
import Flex from '../../components/common/Flex/Flex.tsx';
import { DEFAULT_SORT_OPTION } from '../../constants/filters.constants.ts';
import YouMayAlsoLikeSection from '../../components/shared/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';

const ShopPage = () => {
  const [view, setView] = useState<ViewMode>('grid');
  const [sideFilters, setSideFilters] = useState<ShopFilters>();
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_OPTION);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const { fetchProducts } = useMockProductsApi(SHOP_PAGE_SIZE);
  const { items, totalSize, page, loading, handlePaginationChange, handleFiltersChange } =
    useHandlePagination((page, filters) => fetchProducts(page, filters), SHOP_PAGE_SIZE, true);
  const header =
    categoriesOptions.find((option) => option.value === sideFilters?.category)?.label ||
    'All Categories';

  // Update full filter object when side filters or sortBy change
  useEffect(() => {
    if (!sideFilters) return;
    handleFiltersChange({ ...sideFilters, sortBy });
  }, [sideFilters, sortBy, handleFiltersChange]);

  useEffect(() => {
    getProductCategories()
      .then((data) => setCategoriesOptions(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  return (
    <PageContainer className={styles.shopPage}>
      <SideFilters
        className={styles.shopPageRightSide}
        categoriesOptions={categoriesOptions}
        onFiltersChange={setSideFilters}
      />

      <ViewSwitcher
        isLoading={loading}
        className={styles.shopPageCollection}
        header={header}
        page={page}
        pageSize={SHOP_PAGE_SIZE}
        totalSize={totalSize}
        items={items.map((product, index) => (
          <SmartProductCard
            key={product.id || `product-${product.label}-${index}`}
            product={product}
            direction={view === 'grid' ? 'vertical' : 'horizontal'}
          />
        ))}
        onViewChange={setView}
        onPaginationChange={handlePaginationChange}
        minColWidth={250}
        topBar={
          <Flex>
            <SortProductsWithUrl onSort={setSortBy} />
          </Flex>
        }
      />

      <YouMayAlsoLikeSection mode="carousel" className={styles.shopPageYouMayAlsoLike} />
    </PageContainer>
  );
};

export default ShopPage;
