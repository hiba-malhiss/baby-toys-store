import { useEffect, useRef } from 'react';
import styles from './section.module.scss';
import { Flex, Heading, BouncingDotsLoader } from '@baby-toys/ui-kit';
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

interface SectionProps {
  children?: ReactNode;
  title: string;
  subTitle?: string;
  className?: string;
  compactPadding?: boolean;
  isLoading?: boolean;
  visibleOverFlow?: boolean;
}

const Section = ({
  compactPadding,
  visibleOverFlow,
  subTitle,
  className,
  title,
  children,
  isLoading,
}: SectionProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* IntersectionObserver drives the heading underline reveal */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.isVisible);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    /* Wrapper div owns the ref — avoids any Flex ref-forwarding issues */
    <div ref={wrapperRef} className={clsx(styles.sectionWrapper, className)}>
      <Flex
        className={clsx(
          styles.section,
          compactPadding && styles.sectionCompactPadding,
          visibleOverFlow && styles.sectionVisibleOverFlow
        )}
        direction="vertical"
        justify="center"
        align="center"
        fullWidth
      >
        <Heading level="h1" align="center">
          {title}
        </Heading>

        {subTitle && (
          <Heading level="h5" align="center" className={styles.sectionSubTitle}>
            {subTitle}
          </Heading>
        )}

        {isLoading && (
          <BouncingDotsLoader
            className={!subTitle ? 'bts-paddingVxxxl bts-marginTxxxl' : 'bts-paddingVxxl'}
          />
        )}

        {!isLoading && children}
      </Flex>
    </div>
  );
};

export default Section;
