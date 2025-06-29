import React, { useState, useEffect, useRef } from 'react';
import styles from './carousel.module.scss';
import { Button } from '../Button/Button.tsx';
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
}

const Carousel: React.FC<CarouselProps> = ({
  items = [],
  numVisible = 1,
  orientation = 'horizontal',
  verticalViewPortHeight = '300px',
  circular = false,
  autoplayInterval = 0,
  itemTemplate,
  className = '',
  showNavigation = true,
  navigationStyle = 'overlay',
  responsiveOptions = [],
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [visible, setVisible] = useState(numVisible);
  const intervalRef = useRef<any>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / visible);

  useEffect(() => {
    if (!responsiveOptions?.length) return;
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
  }, [responsiveOptions, numVisible]);

  const goToIndex = (newIndex: number) => {
    if (circular) {
      setCurrentPage((newIndex + totalPages) % totalPages);
    } else {
      setCurrentPage(Math.max(0, Math.min(newIndex, totalPages - 1)));
    }
  };

  const nextSlide = () => goToIndex(currentPage + 1);
  const prevSlide = () => goToIndex(currentPage - 1);

  // Autoplay functionality
  useEffect(() => {
    if (autoplayInterval > 0) {
      intervalRef.current = setInterval(nextSlide, autoplayInterval);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [autoplayInterval, currentPage]);

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Proceed autoplay
  const handleMouseLeave = () => {
    if (autoplayInterval > 0) {
      intervalRef.current = setInterval(nextSlide, autoplayInterval);
    }
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(orientation === 'horizontal' ? e.touches[0].clientX : e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(
      orientation === 'horizontal' ? e.changedTouches[0].clientX : e.changedTouches[0].clientY
    );
    handleSwipe();
  };

  const handleSwipe = () => {
    const threshold = 50;
    const difference = touchStart - touchEnd;

    if (difference > threshold) {
      nextSlide();
    } else if (difference < -threshold) {
      prevSlide();
    }
  };

  const getTransform = () => {
    const percentage = (currentPage * 100) / visible;
    return orientation === 'horizontal'
      ? `translateX(-${percentage}%)`
      : `translateY(-${percentage}%)`;
  };

  // Calculate item width or height
  const getItemSize = () => {
    return `${100 / visible}%`;
  };

  return (
    <div
      className={clsx(
        styles.carousel,
        orientation === 'vertical' && styles.carouselVertical,
        navigationStyle === 'side' && styles.carouselSideNav,
        className
      )}
      style={{ height: orientation === 'vertical' ? verticalViewPortHeight : 'auto' }}
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {showNavigation && (
        <Button
          className={clsx(styles.carouselNavButton, styles.carouselNavButtonPrev)}
          onClick={prevSlide}
          appearance={navigationStyle == 'overlay' ? 'outline' : 'link'}
          size="large"
          isRounded
          leftIcon={ChevronIcons[orientation].prev}
          isDisabled={!circular && currentPage === 0}
        />
      )}

      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={{
            transform: getTransform(),
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={styles.carouselItem}
              style={{
                [orientation === 'horizontal' ? 'width' : 'height']: getItemSize(),
                flexShrink: 0,
              }}
            >
              {itemTemplate(item)}
            </div>
          ))}
        </div>
      </div>

      {showNavigation && (
        <Button
          className={clsx(styles.carouselNavButton, styles.carouselNavButtonNext)}
          onClick={nextSlide}
          appearance={navigationStyle == 'overlay' ? 'outline' : 'link'}
          isRounded
          size="large"
          leftIcon={ChevronIcons[orientation].next}
          isDisabled={!circular && currentPage === totalPages - 1}
        />
      )}
    </div>
  );
};

export default Carousel;
