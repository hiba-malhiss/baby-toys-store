import React from 'react';
import { StringInput, Button, Flex } from '@baby-toys/ui-kit/components';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

type KeyValueObject = Record<string, string>;

interface KeyValueArrayInputProps {
  value: KeyValueObject[];
  onChange: (value: KeyValueObject[]) => void;
  fields: { key: string; placeholder?: string }[];
  addButtonText?: string;
  min?: number;
  fullwidth?: boolean;
}

const KeyValueArrayInput: React.FC<KeyValueArrayInputProps> = ({
  value,
  onChange,
  fields,
  addButtonText = 'Add item',
  min = 0,
  fullwidth,
}) => {
  const handleAdd = () => {
    const emptyEntry: KeyValueObject = fields.reduce((acc, field) => {
      acc[field.key] = '';
      return acc;
    }, {} as KeyValueObject);
    onChange([...value, emptyEntry]);
  };

  const handleRemove = (index: number) => {
    if (value.length > min) {
      const newArray = [...value];
      newArray.splice(index, 1);
      onChange(newArray);
    }
  };

  const handleChange = (index: number, fieldKey: string, fieldValue: string) => {
    const updated = [...value];
    updated[index][fieldKey] = fieldValue;
    onChange(updated);
  };

  return (
    <div>
      {value.map((item, index) => (
        <Flex key={index} spacing="s" align="center" fullwidth={fullwidth} className="bts-marginBs">
          {fields.map((field) => (
            <StringInput
              key={field.key}
              fullwidth={fullwidth}
              value={item[field.key] || ''}
              onChange={(v) => handleChange(index, field.key, v)}
              placeholder={field.placeholder || field.key}
            />
          ))}
          {index >= min && (
            <Button
              onClick={() => handleRemove(index)}
              appearance="outline"
              color="secondary"
              leftIcon={faTrashAlt}
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
      >
        {addButtonText}
      </Button>
    </div>
  );
};

export default KeyValueArrayInput;
