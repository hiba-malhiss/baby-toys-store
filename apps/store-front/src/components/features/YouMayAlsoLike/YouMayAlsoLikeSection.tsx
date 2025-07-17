import React from 'react';
import Section from '../Section/Section.tsx';
import { Carousel, ViewSwitcher } from '@baby-toys/ui-kit/components';
import SmartProductCard from '../SmartProductCard/SmartProductCard.tsx';
import { useMockProductsApi } from '@mock-data/useMockApi';
import { useHandlePagination } from '../../../hooks/useHandlePagination.ts';

interface YouMayAlsoLikeSectionProps {
  mode?: 'carousel' | 'flex';
  className?: string;
}

const PAGE_SIZE = 8;
const YouMayAlsoLikeSection: React.FC<YouMayAlsoLikeSectionProps> = ({
  mode = 'carousel',
  className,
}) => {
  const { fetchProducts } = useMockProductsApi(PAGE_SIZE);
  const { items, totalSize, page, loading, handlePaginationChange, hasMore } = useHandlePagination(
    (page, filters) => fetchProducts(page, filters),
    PAGE_SIZE,
    false,
    'infinite-scroll'
  );

  return (
    <Section title="You May Also Like" className={className} isLoading={loading && page === 1}>
      {mode === 'carousel' ? (
        <Carousel
          className="bts-marginTxxxxl"
          items={items}
          circular
          numVisible={4}
          orientation="horizontal"
          showNavigation
          responsiveOptions={[
            { breakpoint: '900', numVisible: 3 },
            { breakpoint: '600', numVisible: 2 },
            { breakpoint: '400', numVisible: 1 },
          ]}
          itemTemplate={(product) => (
            <SmartProductCard fullWidth product={product} direction="vertical" />
          )}
        />
      ) : (
        <ViewSwitcher
          items={items.map((product) => (
            <SmartProductCard key={product.id} product={product} direction="vertical" />
          ))}
          className="bts-marginTxxxxl"
          page={page}
          pageSize={PAGE_SIZE}
          totalSize={totalSize}
          onPaginationChange={handlePaginationChange}
          staticView="flex"
          paginationMode="infinite-scroll"
          isLoading={loading}
          hasMore={hasMore}
        />
      )}
    </Section>
  );
};

export default YouMayAlsoLikeSection;
