import { useState, useEffect } from 'react';
import styles from './shop-page.module.scss';
import { ViewSwitcher, Flex } from '@baby-toys/ui-kit';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import SmartProductCard from '../../components/features/SmartProductCard/SmartProductCard.tsx';
import { SHOP_PAGE_SIZE } from '../../constants/display.constants.ts';
import type { ShopFilters } from './SideFilters/side-filters.utils.ts';
import { DEFAULT_SORT_OPTION } from '../../constants/filters.constants.ts';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import { SideFilters } from './SideFilters/SideFilters.tsx';
import { SortProductsWithUrl } from './SortProductsWithUrl.tsx';
import { useProductsQuery } from '../../api/productsApi';
import { useCategories } from '../../api/catalogApi.ts';
import type { ViewMode } from '@baby-toys/ui-kit/components/ViewSwitcher/ViewSwitcher.tsx';
import { useUrlFilters } from '../../hooks/useUrlFilters.ts';
import { useTranslation } from 'react-i18next';

const ShopPage = () => {
  const { t } = useTranslation('common');
  const [view, setView] = useState<ViewMode>('grid');
  const [sideFilters, setSideFilters] = useState<ShopFilters>();
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_OPTION);
  const [page, setPage] = useState(1);
  const { data: categories = [] } = useCategories();
  const { urlFilters: searchFilters } = useUrlFilters<{ query?: string }>({ query: (v) => v }, {}, [
    'query',
  ]);
  const query = (searchFilters?.query || '').trim();
  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useProductsQuery({
    page,
    size: SHOP_PAGE_SIZE,
    sortBy,
    filters: { ...(sideFilters || {}), query: query || undefined },
  });
  const items = productsData?.items || [];
  const totalSize = productsData?.totalItems || 0;

  const header =
    categories.find((option) => String(option.id) === String(sideFilters?.categoryId))?.name ||
    t('shop.allCategories', { defaultValue: 'All Categories' });

  // Reset to page 1 on filter/sort change
  useEffect(() => {
    setPage(1);
  }, [sideFilters, sortBy, query]);

  return (
    <PageContainer className={styles.shopPage}>
      <SideFilters className={styles.shopPageRightSide} onFiltersChange={setSideFilters} />

      <ViewSwitcher
        isLoading={isLoading || isFetching}
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
        onPaginationChange={(newPage) => setPage(newPage)}
        minColWidth={250}
        topBar={
          <Flex className={styles.topBar}>
            <SideFilters
              isDrawer
              className={styles.shopPageFilterIcon}
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
