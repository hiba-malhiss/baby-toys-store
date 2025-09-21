import React from 'react';
import StringInput from '../StringInput/StringInput';
import { useToast } from '../Toast/ToastContext';

export interface QuantityInputProps {
  availableInStock: number;
  quantity?: number;
  fullWidth?: boolean;
  onChange?: (val: number) => void;
  onBlur?: (val: number) => void;
}

export const ProductQuantityInput: React.FC<QuantityInputProps> = ({
  availableInStock,
  quantity = 1,
  onChange,
  onBlur,
  fullWidth,
}) => {
  const toast = useToast();

  const handleChange = (val: string | number, byControls = false) => {
    if (val === '' || val === null) {
      onChange?.(1);
      return;
    }

    let parsed = Number(val);
    if (isNaN(parsed) || parsed < 1) {
      parsed = 1;
    }

    if (parsed > availableInStock) {
      parsed = availableInStock;
      toast.info(`Only ${availableInStock} left in stock`);
    }

    onChange?.(parsed, byControls);
  };

  return (
    <StringInput
      fullWidth={fullWidth}
      type="number"
      max={availableInStock}
      withControls
      min={1}
      value={quantity}
      maxTooltip={`Only ${availableInStock} left in stock`}
      onChange={handleChange}
      onBlur={onBlur}
    />
  );
};

export default ProductQuantityInput;
