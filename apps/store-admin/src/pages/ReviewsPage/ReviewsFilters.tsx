import { useState, useEffect } from 'react';
import { Flex, StringInput, Button, Select, Option } from '@baby-toys/ui-kit';
import styles from './reviews-page.module.scss';

interface FiltersProps {
  productId: string;
  userId: string;
  rating: string;
  status: string;
  onChange: (filters: {
    productId: string;
    userId: string;
    rating: string;
    status: string;
  }) => void;
}

const ratingOptions = [
  { label: 'All', value: '' },
  { label: '5 stars', value: '5' },
  { label: '4 stars', value: '4' },
  { label: '3 stars', value: '3' },
  { label: '2 stars', value: '2' },
  { label: '1 star', value: '1' },
];

export const ReviewsFilters = ({ productId, userId, rating, status, onChange }: FiltersProps) => {
  const [productInput, setProductInput] = useState(productId);
  const [userInput, setUserInput] = useState(userId);

  useEffect(() => {
    if (productInput === '' && productId !== '') {
      onChange({ productId: '', userId, rating, status });
    }
  }, [productInput]);

  useEffect(() => {
    if (userInput === '' && userId !== '') {
      onChange({ productId, userId: '', rating, status });
    }
  }, [userInput]);

  return (
    <Flex direction="horizontal" spacing="m" wrap>
      <StringInput
        placeholder="Product ID"
        value={productInput}
        onChange={(v) => setProductInput(v)}
      />
      <StringInput placeholder="User ID" value={userInput} onChange={(v) => setUserInput(v)} />
      <Button
        appearance="outline"
        onClick={() =>
          onChange({
            productId: productInput,
            userId: userInput,
            rating,
            status,
          })
        }
      >
        Search
      </Button>

      <Button
        appearance="outline"
        onClick={() => {
          setProductInput('');
          setUserInput('');
          onChange({ productId: '', userId: '', rating: '', status: '' });
        }}
      >
        Reset
      </Button>

      <Select
        className={styles.wideSelect}
        value={rating}
        onChange={(v) =>
          onChange({
            productId,
            userId,
            rating: String(v ?? ''),
            status,
          })
        }
      >
        {ratingOptions.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    </Flex>
  );
};

export default ReviewsFilters;
