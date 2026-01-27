import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, StringInput, Tooltip } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { LoaderCircle } from 'lucide-react';
import { useUpdateCartItem } from '../../api/cartApi';

interface CartQuantityInputProps {
  itemId: number;
  quantity: number;
  availableInStock: number;
  fullWidth?: boolean;
  className?: string;
  size?: string;
  isDisabled?: boolean;
}

const CartQuantityInput: React.FC<CartQuantityInputProps> = ({
  itemId,
  quantity,
  availableInStock,
  fullWidth,
  className,
  size,
  isDisabled,
}) => {
  const updateMutation = useUpdateCartItem();
  const isLoading = updateMutation.isPending;
  const { t } = useTranslation('common');

  const [localQty, setLocalQty] = useState<number>(quantity);
  const prevQtyRef = useRef<number>(quantity);
  const debounceRef = useRef<number | undefined>(undefined);

  const bounded = useCallback(
    (q: number) => {
      if (Number.isNaN(q) || q < 1) return 1;
      if (availableInStock && q > availableInStock) return availableInStock;
      return q;
    },
    [availableInStock]
  );

  const commit = useCallback(
    (next: number) => {
      prevQtyRef.current = localQty;
      updateMutation.mutate(
        { itemId, quantity: next },
        {
          onError: () => {
            // rollback on error
            setLocalQty(prevQtyRef.current);
          },
        }
      );
    },
    [itemId, updateMutation, localQty]
  );

  const handleChange = useCallback(
    (val: number) => {
      const numeric = Number(val);
      // Prevent increasing above available stock while still allowing decreases/editing
      if (
        availableInStock &&
        typeof numeric === 'number' &&
        !Number.isNaN(numeric) &&
        localQty >= availableInStock &&
        numeric > localQty
      ) {
        return; // ignore increments beyond cap
      }

      const next = bounded(numeric);
      setLocalQty(next);
      // debounce API calls while typing
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
      debounceRef.current = window.setTimeout(() => commit(next), 400);
    },
    [availableInStock, localQty, bounded, commit]
  );

  // Sync local quantity when server-provided quantity prop changes (e.g., after refetch)
  useEffect(() => {
    if (quantity !== prevQtyRef.current) {
      prevQtyRef.current = quantity;
      setLocalQty(quantity);
    }
  }, [quantity]);

  // Cleanup pending timers on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  const maxTooltip = useMemo(
    () => (availableInStock ? t('onlyLeft', { count: availableInStock }) : undefined),
    [availableInStock, t]
  );

  const isAtOrOverMax = useMemo(
    () => Boolean(availableInStock && localQty >= availableInStock),
    [availableInStock, localQty]
  );

  const maxProp = useMemo<number | undefined>(
    () => (isAtOrOverMax ? undefined : availableInStock),
    [isAtOrOverMax, availableInStock]
  );

  const inputEl = useMemo(
    () => (
      <StringInput
        fullWidth={fullWidth}
        type="number"
        size={size}
        min={1}
        max={maxProp}
        withControls
        value={localQty}
        onChange={(v) => handleChange(v as number)}
        isDisabled={isLoading || !!isDisabled}
        maxTooltip={maxTooltip}
      />
    ),
    [fullWidth, maxProp, localQty, handleChange, isLoading, isDisabled, maxTooltip]
  );

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} className={className}>
      <Tooltip content={isAtOrOverMax ? maxTooltip : undefined} position="top">
        <span>{inputEl}</span>
      </Tooltip>
      {isLoading && <Icon icon={LoaderCircle} isSpinning />}
    </span>
  );
};

export default CartQuantityInput;
