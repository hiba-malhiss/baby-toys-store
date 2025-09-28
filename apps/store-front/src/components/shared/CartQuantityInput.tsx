import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StringInput } from '@baby-toys/ui-kit';
import Icon from '@baby-toys/ui-kit/components/Icon/Icon';
import { useUpdateCartItem } from '../../api/cartApi';

interface CartQuantityInputProps {
  itemId: number;
  quantity: number;
  availableInStock: number;
  fullWidth?: boolean;
  className?: string;
  isDisabled?: boolean;
}

const CartQuantityInput: React.FC<CartQuantityInputProps> = ({
  itemId,
  quantity,
  availableInStock,
  fullWidth,
  className,
  isDisabled,
}) => {
  const updateMutation = useUpdateCartItem();
  const isLoading = updateMutation.isPending;

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
      const next = bounded(Number(val));
      setLocalQty(next);
      // debounce API calls while typing
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
      debounceRef.current = window.setTimeout(() => commit(next), 400);
    },
    [bounded, commit]
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
    () => (availableInStock ? `Only ${availableInStock} left in stock` : undefined),
    [availableInStock]
  );

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} className={className}>
      <StringInput
        fullWidth={fullWidth}
        type="number"
        min={1}
        max={availableInStock}
        withControls
        value={localQty}
        onChange={(v) => handleChange(v as number)}
        isDisabled={isLoading || !!isDisabled}
        maxTooltip={maxTooltip}
      />
      {isLoading && <Icon iconName="faSpinner" isSpinning />}
    </span>
  );
};

export default CartQuantityInput;
