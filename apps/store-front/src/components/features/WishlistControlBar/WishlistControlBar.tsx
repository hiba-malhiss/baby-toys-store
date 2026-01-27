import React, { useMemo } from 'react';
import { Flex, Select, Option, Button } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';

export type WishlistControls = {
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  categoryId: number | null;
  stock: '' | 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_SALE';
};

export type CategoryLite = { id: number; name: string };

type Props = {
  value: WishlistControls;
  onChange: (next: WishlistControls) => void;
  onReset?: () => void;
  categories?: CategoryLite[];
};

const WishlistControlBar: React.FC<Props> = ({ value, onChange, onReset, categories = [] }) => {
  const sortValue = useMemo(
    () => `${value.sortBy}:${value.sortDirection}`,
    [value.sortBy, value.sortDirection]
  );
  const { t } = useTranslation('common');

  return (
    <div className="bts-marginBxl">
      <Flex spacing="m" wrap align="center">
        <Select
          value={sortValue}
          onChange={(val) => {
            const [sb, dir] = String(val).split(':');
            onChange({ ...value, sortBy: sb, sortDirection: dir as 'ASC' | 'DESC' });
          }}
          placeholder={t('shop.sortBy')}
        >
          <Option value="id:DESC">
            {t('wishlist.sort.recentlyAdded', { defaultValue: 'Recently added' })}
          </Option>
          <Option value="price:ASC">
            {t('shop.sort.price_asc', { defaultValue: 'Price: Low to High' })}
          </Option>
          <Option value="price:DESC">
            {t('shop.sort.price_desc', { defaultValue: 'Price: High to Low' })}
          </Option>
          <Option value="rating:DESC">
            {t('shop.sort.rating', { defaultValue: 'Rating: High to Low' })}
          </Option>
        </Select>

        {categories.length > 0 && (
          <Select
            value={String(value.categoryId ?? '')}
            onChange={(val) => {
              const v = String(val);
              onChange({ ...value, categoryId: v ? Number(v) : null });
            }}
            placeholder={t('filters.category')}
          >
            <Option value="">{t('shop.allCategories', { defaultValue: 'All Categories' })}</Option>
            {categories.map((c) => (
              <Option key={c.id} value={String(c.id)}>
                {c.name}
              </Option>
            ))}
          </Select>
        )}

        <Select
          value={value.stock ?? 'ALL'}
          onChange={(val) => onChange({ ...value, stock: val as WishlistControls['stock'] })}
          placeholder={t('filters.status', { defaultValue: 'Status' })}
        >
          <Option value="ALL">{t('filters.status', { defaultValue: 'Status' })}</Option>
          <Option value="IN_STOCK">{t('filters.inStock', { defaultValue: 'In stock' })}</Option>
          <Option value="OUT_OF_STOCK">
            {t('filters.outOfStock', { defaultValue: 'Out of stock' })}
          </Option>
          <Option value="ON_SALE">{t('filters.onSale', { defaultValue: 'On sale' })}</Option>
        </Select>

        {onReset && (
          <Button color="secondary-light" onClick={onReset}>
            {t('filters.reset', { defaultValue: 'Reset' })}
          </Button>
        )}
      </Flex>
    </div>
  );
};

export default WishlistControlBar;
