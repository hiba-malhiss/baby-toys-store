import React, { useState, useEffect, useRef } from 'react';
import styles from './carousel.module.scss';
import Button from '../Button/Button.tsx';
import clsx from 'clsx';
import { ChevronIcons } from './carousel.constant.ts';

interface CarouselProps {
  items: any[];
  numVisible?: number;
  orientation?: 'horizontal' | 'vertical';
  verticalViewPortHeight?: string;
  circular?: boolean;
  autoplayInterval?: number;
  itemTemplate: (item: any) => React.ReactNode | Element;
  className?: string;
  showNavigation?: boolean;
  responsiveOptions?: { breakpoint: string; numVisible: number }[];
  navigationStyle?: 'overlay' | 'side';
  size?: 'small' | 'medium' | 'large';
  appearance?: 'default' | 'auto-play';
}

const Carousel: React.FC<CarouselProps> = ({
  items = [],
  numVisible = 1,
  orientation = 'horizontal',
  verticalViewPortHeight = '300px',
  circular = true,
  autoplayInterval = 0,
  itemTemplate,
  className = '',
  showNavigation = true,
  navigationStyle = 'overlay',
  responsiveOptions = [],
  size = 'medium',
  appearance = 'default',
}) => {
  const isAutoPlay = appearance === 'auto-play';

  const [currentPage, setCurrentPage] = useState(0);
  const [visible, setVisible] = useState(numVisible);
  const intervalRef = useRef<any>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;
  const visibleSlides = isAutoPlay ? 1 : visible;
  const totalPages = isAutoPlay ? totalItems : Math.max(totalItems - visibleSlides + 1, 1);

  const isRtl = (() => {
    if (!carouselRef.current) return false;
    try {
      return getComputedStyle(carouselRef.current).direction === 'rtl';
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    if (!responsiveOptions?.length || isAutoPlay) return;

    const handleResize = () => {
      const width = window.innerWidth;
      const sorted = [...responsiveOptions].sort(
        (a, b) => parseInt(a.breakpoint) - parseInt(b.breakpoint)
      );
      const match = sorted.find((opt) => width <= parseInt(opt.breakpoint));
      setVisible(match ? match.numVisible : numVisible);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsiveOptions, numVisible, isAutoPlay]);

  const goToIndex = (newIndex: number) => {
    if (circular) {
      setCurrentPage((newIndex + totalPages) % totalPages);
    } else {
      setCurrentPage(Math.max(0, Math.min(newIndex, totalPages - 1)));
    }
  };

  const nextSlide = () => goToIndex(currentPage + 1);
  const prevSlide = () => goToIndex(currentPage - 1);

  const isHorizontal = orientation === 'horizontal';
  const directionalNext = isHorizontal && isRtl ? prevSlide : nextSlide;
  const directionalPrev = isHorizontal && isRtl ? nextSlide : prevSlide;

  // Autoplay (auto-play = 3s)
  useEffect(() => {
    const intervalTime = isAutoPlay ? 3000 : autoplayInterval;

    if (intervalTime > 0) {
      intervalRef.current = setInterval(() => {
        goToIndex(currentPage + 1);
      }, intervalTime);

      return () => clearInterval(intervalRef.current);
    }
  }, [currentPage, autoplayInterval, isAutoPlay]);

  const getTransform = () => {
    if (isAutoPlay) return undefined;

    const percentage = (currentPage * 100) / visibleSlides;
    return orientation === 'horizontal'
      ? `translateX(${isRtl ? '' : '-'}${percentage}%)`
      : `translateY(-${percentage}%)`;
  };

  return (
    <div
      className={clsx(
        styles.carousel,
        isAutoPlay && styles.carouselHero,
        orientation === 'vertical' && styles.carouselVertical,
        navigationStyle === 'side' && styles.carouselSideNav,
        size === 'small' && styles.carouselSmall,
        className
      )}
      style={{ height: orientation === 'vertical' ? verticalViewPortHeight : 'auto' }}
      ref={carouselRef}
    >
      {!isAutoPlay && showNavigation && (
        <Button
          className={clsx(styles.carouselNavButton, styles.carouselNavButtonPrev)}
          onClick={directionalPrev}
          appearance={navigationStyle === 'overlay' ? 'outline' : 'link'}
          size="large"
          isRounded
          leftIconComp={ChevronIcons[orientation].prev}
        />
      )}

      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={{
            transform: isAutoPlay ? undefined : getTransform(),
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
          }}
        >
          {items.map((item, index) => {
            const isActive = index === currentPage;

            return (
              <div
                key={index}
                className={clsx(
                  styles.carouselItem,
                  isAutoPlay && styles.carouselHeroItem,
                  isAutoPlay && isActive && styles.carouselHeroItemActive
                )}
                style={
                  isAutoPlay
                    ? {}
                    : {
                        [orientation === 'horizontal' ? 'width' : 'height']:
                          `${100 / visibleSlides}%`,
                        flexShrink: 0,
                      }
                }
              >
                {itemTemplate(item)}
              </div>
            );
          })}
        </div>
      </div>

      {!isAutoPlay && showNavigation && (
        <Button
          className={clsx(styles.carouselNavButton, styles.carouselNavButtonNext)}
          onClick={directionalNext}
          appearance={navigationStyle === 'overlay' ? 'outline' : 'link'}
          size="large"
          isRounded
          leftIconComp={ChevronIcons[orientation].next}
        />
      )}

      {/* ✅ AUTO-PLAY DOTS */}
      {isAutoPlay && items?.length > 1 && (
        <div className={styles.carouselDots}>
          {items.map((_, index) => (
            <button
              key={index}
              className={clsx(
                styles.carouselDot,
                index === currentPage && styles.carouselDotActive
              )}
              onClick={() => goToIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
