import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './expandable-content.scss';
import Button, { type ButtonColor } from '../Button/Button.tsx';

type ExpandableContentProps = {
  className?: string;
  maxHeight?: string;
  buttonColor?: ButtonColor;
  children: ReactNode;
};

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  children,
  className,
  maxHeight = '300px',
  buttonColor = 'highlighted',
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
  }, [maxHeight]);

  return (
    <div className={className}>
      <div
        ref={contentRef}
        className={`expandable-section ${expanded ? 'expanded' : ''} ${truncated ? 'truncated' : ''}`}
        style={{
          maxHeight: expanded ? 'none' : maxHeight,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {children}
      </div>
      {truncated && (
        <Button
          withoutPadding
          appearance="link"
          color={buttonColor}
          leftIconComp={expanded ? ChevronUp : ChevronDown}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
};

export default ExpandableContent;
