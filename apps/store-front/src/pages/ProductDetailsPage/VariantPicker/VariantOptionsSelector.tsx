import React, { useEffect, useState } from 'react';
import { Flex, Heading, RadioButtonGroup } from '@baby-toys/ui-kit';
import type { Product } from "../../../api/types/product.ts";

type VariantOptionsSelectorChange = {
  selection: Record<number, number | undefined>;
  variantId?: number;
};

export const VariantOptionsSelector: React.FC<{
  product: Product;
  onChange?: (change: VariantOptionsSelectorChange) => void;
}> = ({ product, onChange }) => {
  const options = (product as any).options ?? [];
  const availableVariants = (product as any).variants ?? [];

  const [selection, setSelection] = useState<Record<number, number | undefined>>({});

  // Find the variant that matches the current selection.
  const deriveVariantId = (sel: Record<number, number | undefined>) => {
    return availableVariants.find((v: any) =>
      Object.entries(sel).every(
        ([tid, vid]) => !vid || Number(v.optionSelectionIds?.[tid]) === Number(vid)
      )
    );
  };

  const handleSelect = (typeId: number, valueId?: number) => {
    if(!valueId) return;
    const next = { ...selection, [typeId]: valueId };
    setSelection(next);
    onChange?.({
      selection: next,
      variantId: deriveVariantId(next),
    });
  };

  useEffect(() => {
    onChange?.({
      selection,
      variantId: deriveVariantId(selection),
    });
  }, []);

  if(!options.length) return null;

  return (
    <Flex direction="vertical" spacing="xs">
      {options.map((option: any) => {
        const typeId = option.type.id;
        const title = option.type.displayName || option.type.name;

        const selectedValue = selection[typeId] != null ? String(selection[typeId]) : '';

        const radioOptions = option.values.map((value: any) => ({
          label: value.display || value.value,
          value: String(value.id),
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
