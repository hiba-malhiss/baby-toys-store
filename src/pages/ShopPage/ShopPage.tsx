import { useState, useEffect, useCallback } from 'react';
import styles from './shop-page.module.scss';
import { type ViewMode, ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard.tsx';
import { SideFilters, type ShopFilters } from './SideFilters/SideFilters.tsx';
import { getProductCategories, useMockProductsApi } from '../../mock-data/useMockProductsApi.ts';
import { SHOP_PAGE_SIZE } from '../../constants/display.constants.ts';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';
import { useUrlFilters } from '../../hooks/useUrlFilters.ts';
import { SortProducts } from './SortProducts.tsx';
import type { Product } from '../../types/product.types.ts';
import type { RadioOption } from '../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import Flex from '../../components/common/Flex/Flex.tsx';
import YouMayAlsoLikeSection from './YouMayAlsoLikeSection.tsx';
import { DEFAULT_SORT_OPTION } from '../../constants/filters.constants.ts';

const ShopPage = () => {
  const [view, setView] = useState<ViewMode>('grid');
  const [categoriesOptions, setCategoriesOptions] = useState<RadioOption[]>([]);
  const { fetchProducts } = useMockProductsApi<Product>(SHOP_PAGE_SIZE);
  const { urlFilters, updateUrlFilters } = useUrlFilters();
  const { items, totalSize, page, loading, handlePaginationChange, handleFiltersChange, filters } =
    useHandlePagination((page, filters) => fetchProducts(page, filters), SHOP_PAGE_SIZE);

  const selectedLabel =
    categoriesOptions.find(({ value }) => value === filters?.category)?.label ?? 'All Categories';

  // Fetch categories once
  useEffect(() => {
    getProductCategories()
      .then((data) => {
        setCategoriesOptions(data.map(({ label, value }) => ({ label, value })));
      })
      .catch((error) => {
        console.error('Error fetching shop categories:', error);
      });
  }, []);

  // Set initial filters from URL
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      handleFiltersChange(urlFilters);
    }
  }, [urlFilters, filters, handleFiltersChange]);

  // Update URL when filters or page change (preserve search param from URL)
  useEffect(() => {
    if (filters) {
      updateUrlFilters({ ...filters, search: urlFilters.search, page });
    }
  }, [filters, page, updateUrlFilters, urlFilters.search]);

  const handleFiltersChangeWrapper = useCallback(
    (shopFilters: ShopFilters) => {
      const apiFilters = {
        category: shopFilters.category,
        color: shopFilters.color,
        brand: shopFilters.brand,
        material: shopFilters.material,
        sortBy: shopFilters.sortBy,
        priceMin: shopFilters.priceRange?.[0],
        priceMax: shopFilters.priceRange?.[1],
        search: shopFilters.search,
      };
      handleFiltersChange(apiFilters);
    },
    [handleFiltersChange]
  );

  const handlePaginationChangeWrapper = useCallback(
    (newPage: number) => {
      handlePaginationChange(newPage);
    },
    [handlePaginationChange]
  );

  const handleSortChangeWrapper = useCallback(
    (sortOption: string) => {
      handleFiltersChangeWrapper({
        ...(filters || {}),
        sortBy: sortOption,
      });
    },
    [filters, handleFiltersChangeWrapper]
  );

  const handleSideFilterChangeWrapper = useCallback(
    (newFilters: ShopFilters) => {
      handleFiltersChangeWrapper({
        ...newFilters,
        sortBy: filters?.sortBy || DEFAULT_SORT_OPTION,
      });
    },
    [filters?.sortBy, handleFiltersChangeWrapper]
  );

  return (
    <PageContainer className={styles.shopPage}>
      <SideFilters
        className={styles.shopPageRightSide}
        onFiltersChange={handleSideFilterChangeWrapper}
        initialFilters={filters}
        categoriesOptions={categoriesOptions}
      />

      <ViewSwitcher
        isLoading={loading}
        className={styles.shopPageCollection}
        header={selectedLabel}
        page={page}
        pageSize={SHOP_PAGE_SIZE}
        totalSize={totalSize}
        topBar={
          <Flex>
            <SortProducts selected={filters?.sortBy} onSort={handleSortChangeWrapper} />
          </Flex>
        }
        items={items.map((product, index) => (
          <SmartProductCard
            key={product.id || `product-${product.label}-${index}`}
            product={product}
            direction={view === 'grid' ? 'vertical' : 'horizontal'}
          />
        ))}
        onViewChange={setView}
        onPaginationChange={handlePaginationChangeWrapper}
        minColWidth={250}
      />

      <YouMayAlsoLikeSection />
    </PageContainer>
  );
};

export default ShopPage;
