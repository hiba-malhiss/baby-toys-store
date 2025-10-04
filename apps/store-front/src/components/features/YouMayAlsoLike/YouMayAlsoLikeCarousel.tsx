import React from 'react';
import Section from '../Section/Section.tsx';
import { Carousel, SkeletonProductCard } from '@baby-toys/ui-kit';
import SmartProductCard from '../SmartProductCard/SmartProductCard.tsx';
import { BREAKPOINTS } from '@baby-toys/ui-kit/constants/breakpoints';
import { useHighlightsQuery } from '../../../api/highlightsApi';
import { useTranslation } from 'react-i18next';

interface YouMayAlsoLikeCarouselProps {
  className?: string;
  pageSize?: number;
  title?: string;
}

const DEFAULT_PAGE_SIZE = 12;

const YouMayAlsoLikeCarousel: React.FC<YouMayAlsoLikeCarouselProps> = ({
  className,
  pageSize = DEFAULT_PAGE_SIZE,
  title = undefined,
}) => {
  const { data, isLoading } = useHighlightsQuery(1, pageSize);
  const items = data?.items ?? [];
  const { t } = useTranslation('common');

  return (
    <Section
      title={title || t('highlights.youMayAlsoLike')}
      className={className}
      isLoading={isLoading}
    >
      <Carousel
        className="bts-marginTxxxxl"
        items={isLoading ? Array.from({ length: Math.min(8, pageSize) }) : items}
        circular
        numVisible={4}
        orientation="horizontal"
        showNavigation
        responsiveOptions={[
          { breakpoint: BREAKPOINTS.large, numVisible: 4 },
          { breakpoint: BREAKPOINTS.medium, numVisible: 3 },
          { breakpoint: BREAKPOINTS.small, numVisible: 2 },
        ]}
        itemTemplate={(item) =>
          isLoading ? (
            <SkeletonProductCard />
          ) : (
            <SmartProductCard fullWidth product={item} direction="vertical" />
          )
        }
      />
    </Section>
  );
};

export default YouMayAlsoLikeCarousel;
