import React from 'react';
import RadioButtonGroup from '../../components/common/RadioButtonGroup/RadioButtonGroup.tsx';
import RadioButton from '../../components/common/RadioButtonGroup/RadioButton.tsx';
import { categoriesRadioOptions } from '../../mock-data/shop-page.ts';
import Card from '../../components/common/Card/Card.tsx';

interface CategoryFilterProps {
  selectedCategory: string;
  onChange: (value: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onChange }) => {
  return (
    <Card header="Categories">
      <RadioButtonGroup
        spacing="xxxl"
        name="categories"
        selectedValue={selectedCategory}
        onChange={onChange}
        direction="vertical"
        align="start"
        appearance="link"
      >
        {categoriesRadioOptions.map(({ label, value }) => (
          <RadioButton key={value} value={value}>
            <span>+</span> {label}
          </RadioButton>
        ))}
      </RadioButtonGroup>
    </Card>
  );
};

export default CategoryFilter;
