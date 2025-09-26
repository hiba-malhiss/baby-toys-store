import React from 'react';
import YouMayAlsoLikeCarousel from './YouMayAlsoLikeCarousel';
import YouMayAlsoLikeList from './YouMayAlsoLikeList';

interface YouMayAlsoLikeSectionProps {
  mode?: 'carousel' | 'flex';
  className?: string;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 12;
const YouMayAlsoLikeSection: React.FC<YouMayAlsoLikeSectionProps> = ({
  mode = 'carousel',
  className,
  pageSize = DEFAULT_PAGE_SIZE,
}) => {
  if (mode === 'carousel') {
    return <YouMayAlsoLikeCarousel className={className} pageSize={pageSize} />;
  }

  return <YouMayAlsoLikeList className={className} pageSize={pageSize} />;
};

export default YouMayAlsoLikeSection;
