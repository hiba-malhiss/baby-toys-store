import React from 'react';
import { StringInput, TextArea, Button, Flex } from '@baby-toys/ui-kit';
import { Plus, Trash2 } from 'lucide-react';

interface StringArrayInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  min?: number;
  fullwidth?: boolean;
  max?: number;
  rows?: number;
  textarea?: boolean;
}

const StringArrayInput: React.FC<StringArrayInputProps> = ({
  value,
  onChange,
  placeholder,
  min = 0,
  addButtonText = 0,
  fullwidth,
  max,
  textarea = false,
  rows = 1,
}) => {
  const handleAdd = () => {
    if (typeof max === 'number' && value.length >= max) return;
    onChange([...value, '']);
  };

  const handleRemove = (index: number) => {
    if (value.length > 1) {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    }
  };

  const handleChange = (index: number, newValue: string) => {
    const updatedValue = [...value];
    updatedValue[index] = newValue;
    onChange(updatedValue);
  };

  return (
    <div>
      {value.map((item, index) => (
        <Flex key={index} spacing="s" align="center" fullwidth={fullwidth} className="bts-marginBs">
          {textarea ? (
            <TextArea
              fullwidth={fullwidth as any}
              value={item}
              onChange={(v) => handleChange(index, v)}
              placeholder={placeholder}
              rows={rows}
            />
          ) : (
            <StringInput
              fullwidth={fullwidth}
              value={item}
              onChange={(v) => handleChange(index, v)}
              placeholder={placeholder}
            />
          )}
          {index >= min && (
            <Button
              onClick={() => handleRemove(index)}
              appearance="outline"
              color="secondary"
              leftIconComp={Trash2}
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
        leftIconComp={Plus}
        isDisabled={typeof max === 'number' && value.length >= max}
      >
        {addButtonText || 'Add item'}
      </Button>
    </div>
  );
};

export default StringArrayInput;
