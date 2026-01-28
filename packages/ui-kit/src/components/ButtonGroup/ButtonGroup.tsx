import React, { Children, cloneElement, isValidElement } from 'react';
import clsx from 'clsx';
import styles from './button-group.module.scss';

export type ButtonGroupDirection = 'horizontal' | 'vertical';

type ButtonGroupProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  direction?: ButtonGroupDirection;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  fullWidth = false,
  direction = 'horizontal',
}) => {
  const items = Children.toArray(children);

  const enhancedChildren = items.map((child, idx) => {
    if (!isValidElement(child)) return child;

    const childClass = clsx(
      styles.groupItem,
      idx === 0 && styles.isFirst,
      idx === items.length - 1 && styles.isLast,
      items.length > 1 && styles.hasSiblings,
      direction === 'vertical' && styles.vertical
    );

    // Inject a wrapper className into Button. Button puts `className` on its outer wrapper div.
    return cloneElement(child as any, {
      className: clsx((child as any).props?.className, childClass),
    });
  });

  return (
    <div
      className={clsx(
        styles.buttonGroup,
        styles[direction],
        fullWidth && styles.fullWidth,
        className
      )}
    >
      {enhancedChildren}
    </div>
  );
};

export default ButtonGroup;
