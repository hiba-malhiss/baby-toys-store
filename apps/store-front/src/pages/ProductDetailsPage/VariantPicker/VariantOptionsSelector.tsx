import React, { useEffect, useState } from 'react';
import { Flex, Heading, RadioButtonGroup } from '@baby-toys/ui-kit';
import type { Product } from '../../../api/types/product.ts';

export type VariantOptionsSelectorChange = {
  selection: Record<number, number | undefined>;
  variantId?: number;
};

export const VariantOptionsSelector: React.FC<{
  product: Product;
  className?: string;
  onChange?: (change: VariantOptionsSelectorChange) => void;
}> = ({ product, onChange, className }) => {
  const options = (product as any).options ?? [];
  const availableVariants = (product as any).variants ?? [];

  // Initialize selection with defaultVariant
  const initialSelection: Record<number, number | undefined> = {};
  if (product.defaultVariant?.optionSelectionIds) {
    Object.entries(product.defaultVariant?.optionSelectionIds || {}).forEach(([typeId, valueId]) => {
      initialSelection[Number(typeId)] = valueId as number;
    });
  }

  const [selection, setSelection] = useState<Record<number, number | undefined>>(initialSelection);

  // Find the variant that matches the current selection
  const deriveVariantId = (sel: Record<number, number | undefined>) => {
    const variant = availableVariants.find((v: any) =>
      Object.entries(sel).every(
        ([tid, vid]) => !vid || Number(v.optionSelectionIds?.[tid]) === Number(vid)
      )
    );
    return variant?.id;
  };

  // Compute which option values should be disabled (out-of-stock or incompatible)
  const computeDisabledValues = (currentSelection: Record<number, number | undefined>) => {
    const disabledMap: Record<number, Set<number>> = {};

    options.forEach((option: any, index: number) => {
      const typeId = option.type.id;
      disabledMap[typeId] = new Set();

      option.values.forEach((value: any) => {
        if (index === 0) return; // always enable first attribute

        const testSelection = { ...currentSelection, [typeId]: value.id };

        const isCompatible = availableVariants.some((v: any) => {
          const matches = Object.entries(testSelection).every(
            ([tid, vid]) => !vid || Number(v.optionSelectionIds?.[tid]) === Number(vid)
          );
          const inStock = (v.stockQuantity ?? 0) > 0 && (v.isActive ?? true);
          return matches && inStock;
        });

        if (!isCompatible && currentSelection[typeId] !== value.id) {
          disabledMap[typeId].add(value.id);
        }
      });
    });

    return disabledMap;
  };

  // Update selection: auto-adjust incompatible or disabled values
  const handleSelect = (typeId: number, valueId?: number) => {
    let next = { ...selection, [typeId]: valueId };

    options.forEach((option: any) => {
      const currentTypeId = option.type.id;
      if (currentTypeId === typeId) return;

      const selectedValue = next[currentTypeId];

      const compatibleValues = option.values.filter((value: any) =>
        availableVariants.some((v: any) => {
          const matches = Object.entries({ ...next, [currentTypeId]: value.id }).every(
            ([tid, vid]) => !vid || Number(v.optionSelectionIds?.[tid]) === Number(vid)
          );
          const inStock = (v.stockQuantity ?? 0) > 0 && (v.isActive ?? true);
          return matches && inStock;
        })
      );

      // If current selection is disabled, select first compatible value
      if (!selectedValue || !compatibleValues.some((v) => v.id === selectedValue)) {
        next[currentTypeId] = compatibleValues.length ? compatibleValues[0].id : undefined;
      }
    });

    setSelection(next);
    onChange?.({
      selection: next,
      variantId: deriveVariantId(next),
    });
  };

  const disabledValues = computeDisabledValues(selection);

  useEffect(() => {
    // Trigger onChange initially with defaultVariant selection
    onChange?.({
      selection,
      variantId: deriveVariantId(selection),
    });
  }, []);

  if (!options.length) return null;

  return (
    <Flex direction="vertical" spacing="xs" className={className}>
      {options.map((option: any, index: number) => {
        const typeId = option.type.id;
        const title = option.type.displayName || option.type.name;
        const selectedValue = selection[typeId] != null ? String(selection[typeId]) : '';

        const radioOptions = option.values.map((value: any) => ({
          label: value.display || value.value,
          value: String(value.id),
          isDisabled: index !== 0 && disabledValues[typeId]?.has(value.id), // first attribute always enabled
        }));

        return (
          <Flex key={typeId} spacing="s" align="center">
            <Heading level="h6">{title}</Heading>
            <RadioButtonGroup
              appearance="outlineChip"
              options={radioOptions}
              selectedValue={selectedValue}
              name={`option-${typeId}`}
              onChange={(val) => handleSelect(typeId, val ? Number(val) : undefined)}
              justify="start"
              size="small"
              spacing="xs"
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

export default VariantOptionsSelector;
