import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

const getRatingOptions = (t: any) => [
  { label: t('app.common.all'), value: '' },
  { label: t('app.reviews.filters.ratingOptions.fiveStars'), value: '5' },
  { label: t('app.reviews.filters.ratingOptions.fourStars'), value: '4' },
  { label: t('app.reviews.filters.ratingOptions.threeStars'), value: '3' },
  { label: t('app.reviews.filters.ratingOptions.twoStars'), value: '2' },
  { label: t('app.reviews.filters.ratingOptions.oneStar'), value: '1' },
];

export const ReviewsFilters = ({ productId, userId, rating, status, onChange }: FiltersProps) => {
  const { t } = useTranslation('common');
  const [productInput, setProductInput] = useState(productId);
  const [userInput, setUserInput] = useState(userId);
  const ratingOptions = useMemo(() => getRatingOptions(t), [t]);

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
        placeholder={t('app.reviews.filters.productIdPlaceholder')}
        value={productInput}
        onChange={(v) => setProductInput(v)}
      />
      <StringInput
        placeholder={t('app.reviews.filters.userIdPlaceholder')}
        value={userInput}
        onChange={(v) => setUserInput(v)}
      />
      <Button
        appearance="filled"
        onClick={() =>
          onChange({
            productId: productInput,
            userId: userInput,
            rating,
            status,
          })
        }
      >
        {t('app.common.search')}
      </Button>
      <Select
        className={styles.reviewPageSelect}
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
      <Button
        appearance="filled"
        color="secondary"
        onClick={() => {
          setProductInput('');
          setUserInput('');
          onChange({ productId: '', userId: '', rating: '', status: '' });
        }}
      >
        {t('app.common.resetAll')}
      </Button>
    </Flex>
  );
};

export default ReviewsFilters;
