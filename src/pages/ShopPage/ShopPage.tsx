import { useState, useCallback, useEffect } from 'react';
import styles from './shop-page.module.scss';
import { type ViewMode, ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard.tsx';
import Section from '../../components/layout/Section/Section.tsx';
import Carousel from '../../components/common/Carousel/Carousel.tsx';
import { SideFilters, type ShopFilters } from './SideFilters/SideFilters.tsx';
import { getProductCategories, useMockProductsApi } from '../../mock-data/useMockProductsApi.ts';
import { DEFAULT_SORT_OPTION } from '../../constants/filters.constants.ts';
import { SHOP_PAGE_SIZE } from '../../constants/display.constants.ts';
import { useHandlePagination } from '../../hooks/useHandlePagination.ts';
import { useUrlFilters } from '../../hooks/useUrlFilters.ts';
import { SortProducts } from './SortProducts.tsx';
import type { Product } from '../../types/product.types.ts';
import type { RadioOption } from '../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import Flex from '../../components/common/Flex/Flex.tsx';

const ShopPage = () => {
  const [view, setView] = useState<ViewMode>('grid');
  const [categoriesOptions, setCategoriesOptions] = useState<RadioOption[]>([]);
  const { fetchProducts } = useMockProductsApi<Product>(SHOP_PAGE_SIZE);
  const { filters: urlFilters, updateFilters } = useUrlFilters();
  const [relatedItems, setRelatedItems] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const { items, totalSize, page, loading, handlePaginationChange, handleFiltersChange, filters } =
    useHandlePagination(
      (page, filters) => fetchProducts(page, filters),
      SHOP_PAGE_SIZE,
      urlFilters
    );

  useEffect(() => {
    getProductCategories()
      .then((data) => {
        // For shop, use all categories as radio options (label/value)
        setCategoriesOptions(data.map(({ label, value }) => ({ label, value })));
      })
      .catch((error) => {
        console.error('Error fetching shop categories:', error);
      });
  }, []);

  // fetch related products
  useEffect(() => {
    setRelatedLoading(true);
    fetchProducts(1, { sortBy: DEFAULT_SORT_OPTION })
      .then((data) => {
        setRelatedItems(data.items);
      })
      .catch((error) => {
        console.error('Error fetching related products:', error);
      })
      .finally(() => setRelatedLoading(false));
  }, [fetchProducts]);

  // Update URL when filters change
  useEffect(() => {
    if (filters) {
      updateFilters({ ...filters, page });
    }
  }, [filters, page, updateFilters]);

  const selectedLabel =
    categoriesOptions.find(({ value }) => value === filters?.category)?.label ?? 'All Categories';

  const handleFiltersChangeWrapper = useCallback(
    (shopFilters: ShopFilters) => {
      // Convert ShopFilters to API filters format (include all fields)
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

  return (
    <PageContainer className={styles.shopPage}>
      <SideFilters
        className={styles.shopPageRightSide}
        onFiltersChange={handleFiltersChangeWrapper}
        initialFilters={{
          category: filters?.category,
          sortBy: filters?.sortBy,
          search: filters?.search,
          priceRange:
            filters?.priceMin && filters?.priceMax
              ? [filters.priceMin, filters.priceMax]
              : undefined,
          brand: filters?.brand,
        }}
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
            <SortProducts
              selected={filters?.sortBy}
              onSort={(sortOption) =>
                handleFiltersChangeWrapper({ ...filters, sortBy: sortOption })
              }
            />
          </Flex>
        }
        items={items.map((toy, index) => (
          <SmartProductCard
            key={toy.id || `product-${toy.label}-${index}`}
            product={toy}
            direction={view === 'grid' ? 'vertical' : 'horizontal'}
          />
        ))}
        onViewChange={setView}
        onPaginationChange={handlePaginationChangeWrapper}
        minColWidth={250}
      />

      <Section title="You May Also Like" className={styles.shopPageRelatedProducts}>
        {relatedLoading && 'Loading...'}
        <Carousel
          className="bts-marginTxxxxl"
          items={relatedItems}
          circular
          numVisible={4}
          orientation="horizontal"
          showNavigation
          responsiveOptions={[
            { breakpoint: '900', numVisible: 3 },
            { breakpoint: '600', numVisible: 2 },
            { breakpoint: '400', numVisible: 1 },
          ]}
          itemTemplate={(toy) => <SmartProductCard fullWidth product={toy} direction="vertical" />}
        />
      </Section>
    </PageContainer>
  );
};

export default ShopPage;
