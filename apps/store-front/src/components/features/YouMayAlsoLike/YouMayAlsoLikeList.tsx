import React from 'react';
import Section from '../Section/Section.tsx';
import { ViewSwitcher } from '@baby-toys/ui-kit';
import SmartProductCard from '../SmartProductCard/SmartProductCard.tsx';
import { useHighlightsInfiniteQuery } from '../../../api/highlightsApi';
import { useTranslation } from 'react-i18next';
import { BREAKPOINTS } from '@baby-toys/ui-kit/constants/breakpoints.ts';

interface YouMayAlsoLikeListProps {
  className?: string;
  pageSize?: number;
  title?: string;
}

const DEFAULT_PAGE_SIZE = 24;

const YouMayAlsoLikeList: React.FC<YouMayAlsoLikeListProps> = ({
  className,
  pageSize = DEFAULT_PAGE_SIZE,
  title = undefined,
}) => {
  const infiniteQuery = useHighlightsInfiniteQuery(pageSize);
  const { t } = useTranslation('common');

  const items = infiniteQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const totalSize = infiniteQuery.data?.pages?.[0]?.totalItems ?? 0;
  const page = infiniteQuery.data?.pages.length ?? 1;
  const loading = infiniteQuery.isFetchingNextPage || infiniteQuery.isLoading;
  const hasMore = Boolean(infiniteQuery.hasNextPage);

  const handlePaginationChange = (newPage: number) => {
    if (newPage > page && infiniteQuery.hasNextPage) {
      infiniteQuery.fetchNextPage();
    }
  };

  return (
    <Section
      title={title || t('highlights.youMayAlsoLike')}
      className={className}
      isLoading={loading && page === 1}
    >
      <ViewSwitcher
        items={items.map((product) => (
          <SmartProductCard key={product.id} product={product} direction="vertical" />
        ))}
        className="bts-marginTxxxxl"
        page={page}
        pageSize={pageSize}
        totalSize={totalSize}
        onPaginationChange={handlePaginationChange}
        staticView="grid"
        responsiveMinWidth={[
          { breakpoint: BREAKPOINTS.large, minWidth: 250 },
          { breakpoint: BREAKPOINTS.medium, minWidth: 180 },
          { breakpoint: BREAKPOINTS.small, minWidth: 150 },
        ]}
        paginationMode="infinite-scroll"
        isLoading={loading}
        hasMore={hasMore}
      />
    </Section>
  );
};

export default YouMayAlsoLikeList;
