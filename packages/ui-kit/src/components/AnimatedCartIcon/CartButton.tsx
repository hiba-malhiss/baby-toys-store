import React, { useId } from 'react';
import clsx from 'clsx';
import styles from './cart-button.module.scss';

export interface CartButtonProps {
  checked?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  title?: string;
  ariaLabel?: string;
  onToggle?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CartButton: React.FC<CartButtonProps> = ({
  checked = false,
  disabled = false,
  isLoading = false,
  className,
  title = 'Add to cart',
  ariaLabel,
  onToggle,
}) => {
  const inputId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isLoading) {
      event.preventDefault();
      return;
    }
    onToggle?.(event.target.checked, event);
  };

  return (
    <label
      htmlFor={inputId}
      title={title}
      className={clsx(
        styles.cartContainer,
        className,
        (disabled || isLoading) && styles.isDisabled
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        disabled={disabled || isLoading}
        onChange={handleChange}
        aria-label={ariaLabel ?? title}
      />

      {isLoading && <span className={styles.spinner} />}

      <div className={styles.svgContainer}>
        {/* outline */}
        <svg viewBox="0 0 24 24" className={styles.svgOutline}>
          <path
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10
          0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.17
          14h9.66c.75 0 1.41-.41 1.75-1.03l3.58-6.49a1 1 0 0 0-.87-1.48H6.21L5.27
          2H1v2h3l3.6 7.59-1.35 2.44A2 2 0 0 0 8 16h12v-2H8.42l.75-1.36Z"
          />
        </svg>

        {/* filled */}
        <svg viewBox="0 0 24 24" className={styles.svgFilled}>
          <path
            d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2
          2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-2 .9-2 2s.9 2 2
          2 2-.9 2-2-.9-2-2-2ZM6.2 6l.94 2h12.45l-3.2 5.8H9.1L7.16
          6Z"
          />
        </svg>

        {/* celebrate */}
        <svg viewBox="0 0 100 100" className={styles.svgCelebrate}>
          <circle cx="20" cy="20" r="3" />
          <circle cx="80" cy="30" r="3" />
          <circle cx="50" cy="10" r="3" />
          <circle cx="30" cy="70" r="3" />
          <circle cx="70" cy="80" r="3" />
        </svg>
      </div>
    </label>
  );
};

export default CartButton;
