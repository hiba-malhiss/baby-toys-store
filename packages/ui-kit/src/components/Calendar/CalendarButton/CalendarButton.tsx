import React, { useEffect, useState } from 'react';
import styles from './CalendarButton.module.scss';
import clsx from 'clsx';
import { SelectionStatus } from '../utils/getSelectionStatus';

type CalendarButtonProps = {
  isDisabled?: boolean;
  appearance?: 'box' | 'rounded';
  isFirstColumn?: boolean;
  isLastColumn?: boolean;
  selectionStatus: SelectionStatus;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
};

const CalendarButton = ({
  isDisabled = false,
  appearance = 'box',
  isFirstColumn = false,
  isLastColumn = false,
  selectionStatus,
  onClick,
  children,
}: CalendarButtonProps) => {
  const [className, setClassName] = useState('');

  useEffect(() => {
    const classes = clsx(styles.calendarButton, {
      [styles.isDisabled]: isDisabled,
      [styles[`${appearance}-appearance`]]: appearance,
      [styles.isSelected]: selectionStatus.isSelected,
      [styles.isHighlighted]: selectionStatus.isSelectedSecondary,
      [styles.isHighlightedMiddle]: selectionStatus.isMiddleInterval,
      [styles.isHighlightedRangeStart]: selectionStatus.isStartInterval,
      [styles.isHighlightedRangeEnd]: selectionStatus.isEndInterval,
      [styles.isFirstColumn]: isFirstColumn,
      [styles.isLastColumn]: isLastColumn,
    });

    setClassName(classes);
  }, [isDisabled, appearance, selectionStatus]);

  const handleClick = (event) => {
    event.stopPropagation();
    if (!isDisabled && onClick) {
      onClick(event);
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

export default CalendarButton;
