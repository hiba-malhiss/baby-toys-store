import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './expandable-content.scss';
import { Button } from '../Button/Button.tsx';

type ExpandableContentProps = {
  className?: string;
  maxHeight?: string;
  children: ReactNode;
};

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  children,
  className,
  maxHeight = '300px',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const previousMaxHeight = el.style.maxHeight;
    el.style.maxHeight = 'none';

    const contentFits = el.scrollHeight <= parseInt(maxHeight);

    el.style.maxHeight = previousMaxHeight;

    setExpanded(contentFits);
    setTruncated(!contentFits);
  }, [maxHeight, children]);

  return (
    <div className={className}>
      <div
        ref={contentRef}
        className={`expandable-section ${expanded ? 'expanded' : ''} ${truncated ? 'truncated' : ''}`}
        style={{
          maxHeight: expanded ? 'none' : maxHeight,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {truncated && (
        <Button
          withoutPadding
          appearance="link"
          color="highlighted"
          leftIcon={expanded ? faChevronUp : faChevronDown}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
};

export default ExpandableContent;
