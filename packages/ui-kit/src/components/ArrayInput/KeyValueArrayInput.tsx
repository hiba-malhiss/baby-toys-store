import React from 'react';
import { StringInput, Button, Flex } from '@baby-toys/ui-kit';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export interface KeyValuePair {
  label: string;
  value: string;
}

interface KeyValueArrayInputProps {
  value: KeyValuePair[];
  onChange: (value: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addButtonText?: string;
  minItems?: number;
  fullWidth?: boolean;
  isDisabled?: boolean;
}

const KeyValueArrayInput: React.FC<KeyValueArrayInputProps> = ({
  value = [],
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  addButtonText = 'Add item',
  minItems = 0,
  fullWidth = true,
  isDisabled = false,
}) => {
  // Ensure value is always an array
  const items = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    onChange([...items, { label: '', value: '' }]);
  };

  const handleRemove = (index: number) => {
    if (items.length <= minItems) return;
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleChange = (index: number, field: 'label' | 'value', newValue: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: newValue };
    onChange(newItems);
  };

  return (
    <Flex spacing="m" direction="vertical">
      {items.map((item, index) => (
        <Flex key={index} spacing="s" align="center" fullWidth={fullWidth}>
          <Flex spacing="s">
            <StringInput
              value={item.label}
              onChange={(v) => handleChange(index, 'label', v)}
              placeholder={keyPlaceholder}
              fullWidth={fullWidth}
              isDisabled={isDisabled}
            />
          </Flex>
          <div style={{ flex: 1 }}>
            <StringInput
              value={item.value}
              onChange={(v) => handleChange(index, 'value', v)}
              placeholder={valuePlaceholder}
              fullWidth={fullWidth}
              isDisabled={isDisabled}
            />
          </div>
          {index >= minItems && (
            <Button
              onClick={() => handleRemove(index)}
              appearance="outline"
              color="secondary"
              leftIcon={faTrashAlt}
              isDisabled={isDisabled}
            />
          )}
        </Flex>
      ))}
      <Button
        onClick={handleAdd}
        appearance="link"
        className="bts-marginTs"
        withoutPadding
        color="underline"
        leftIcon={faPlus}
        isDisabled={isDisabled}
      >
        {addButtonText}
      </Button>
    </Flex>
  );
};
export default KeyValueArrayInput;
