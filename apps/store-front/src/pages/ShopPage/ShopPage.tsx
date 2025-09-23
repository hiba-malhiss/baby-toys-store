import { useState, useEffect } from 'react';
import styles from './shop-page.module.scss';
import { ViewSwitcher, Flex } from '@baby-toys/ui-kit';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import SmartProductCard from '../../components/features/SmartProductCard/SmartProductCard.tsx';
import { getProductCategories, useMockProductsApi } from '@mock-data/useMockApi';
import { SHOP_PAGE_SIZE } from '../../constants/display.constants.ts';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';
import type { ShopFilters } from './SideFilters/side-filters.utils.ts';
import { DEFAULT_SORT_OPTION } from '../../constants/filters.constants.ts';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import type { ViewMode } from '@baby-toys/ui-kit';
import { SideFilters } from './SideFilters/SideFilters.tsx';
import { SortProductsWithUrl } from './SortProductsWithUrl.tsx';
import type { Category } from '@baby-toys/types';

const ShopPage = () => {
  const [view, setView] = useState<ViewMode>('grid');
  const [sideFilters, setSideFilters] = useState<ShopFilters>();
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_OPTION);
  const [categoriesOptions, setCategoriesOptions] = useState<Category[]>([]);
  const { fetchProducts } = useMockProductsApi(SHOP_PAGE_SIZE);
  const { items, totalSize, page, loading, handlePaginationChange, handleFiltersChange } =
    useHandlePagination((page, filters) => fetchProducts(page, filters), SHOP_PAGE_SIZE, true);
  const header =
    categoriesOptions.find((option) => option.id === sideFilters?.categoryId)?.name ||
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
          <Flex className={styles.topBar}>
            <SideFilters
              isDrawer
              className={styles.shopPageFilterIcon}
              categoriesOptions={categoriesOptions}
              onFiltersChange={setSideFilters}
            />
            <SortProductsWithUrl onSort={setSortBy} />
          </Flex>
        }
      />

      <YouMayAlsoLikeSection mode="carousel" className={styles.shopPageYouMayAlsoLike} />
    </PageContainer>
  );
};

export default ShopPage;
