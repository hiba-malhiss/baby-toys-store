import React from 'react';
import { StringInput } from '../../common/StringInput/StringInput.tsx';

export interface QuantityInputProps {
  availableInStock: number;
  quantity?: number;
  fullWidth?: boolean;
  onChange?: (val: number) => void;
}

export const ProductQuantityInput: React.FC<QuantityInputProps> = ({
  availableInStock,
  quantity = 1,
  onChange,
  fullWidth,
}) => {
  const handleChange = (val: string | number) => {
    const parsed = Number(val);
    onChange?.(parsed);
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
    />
  );
};

export default ProductQuantityInput;
