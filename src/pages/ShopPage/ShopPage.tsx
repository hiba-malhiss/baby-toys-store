import { useState, useCallback, useEffect } from 'react';
import styles from './shop-page.module.scss';
import { type ViewMode, ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher.tsx';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import SmartProductCard from '../../components/smart/SmartProductCard/SmartProductCard.tsx';
import Section from '../../components/layout/Section/Section.tsx';
import Carousel from '../../components/common/Carousel/Carousel.tsx';
import { SideFilters, type ShopFilters } from './SideFilters/SideFilters.tsx';
import { useMockProductsApi } from '../../mock-data/useMockProductsApi.ts';
import { useShowMorePagination } from '../../hooks/useShowMorePagination.ts';
import { useUrlFilters } from '../../hooks/useUrlFilters.ts';
import { SortProducts } from './SortProducts.tsx';
import type { Product } from '../../types/product.types.ts';
import type { RadioOption } from '../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';

const PAGE_SIZE = 8;

const ShopPage = () => {
  const [view, setView] = useState<ViewMode>('grid');
  const [categoriesOptions, setCategoriesOptions] = useState<RadioOption[]>([]);
  const { fetchProducts, getShopCategories } = useMockProductsApi<Product>(PAGE_SIZE);
  const { filters: urlFilters, updateFilters } = useUrlFilters();

  // Load shop categories
  useEffect(() => {
    getShopCategories()
      .then(setCategoriesOptions)
      .catch((error) => {
        console.error('Error fetching shop categories:', error);
      });
  }, [getShopCategories]);

  // Main products pagination with URL filters
  const { items, totalSize, page, loading, handlePaginationChange, handleFiltersChange, filters } =
    useShowMorePagination(
      (page, filters) => fetchProducts(page, filters),
      PAGE_SIZE,
      urlFilters // Initialize with URL filters
    );

  // Related products fetch (no pagination)
  const [relatedItems, setRelatedItems] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    setRelatedLoading(true);
    fetchProducts(1, { sortBy: 'featured' })
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
    (newPage: number, pageSize: number) => {
      handlePaginationChange(newPage, pageSize);
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
            filters?.priceMin || filters?.priceMax
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
        pageSize={PAGE_SIZE}
        totalSize={totalSize}
        topBar={
          <SortProducts
            selected={filters?.sortBy}
            onSort={(sortOption) => handleFiltersChangeWrapper({ ...filters, sortBy: sortOption })}
          />
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
          itemTemplate={(toy, index) => (
            <SmartProductCard
              fullWidth
              key={toy.id || `carousel-${toy.label}-${index}`}
              product={toy}
              direction="vertical"
            />
          )}
        />
      </Section>
    </PageContainer>
  );
};

export default ShopPage;
