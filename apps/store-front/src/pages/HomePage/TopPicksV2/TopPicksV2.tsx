import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard, RadioButtonGroup, Button, Flex, SkeletonProductCard } from '@baby-toys/ui-kit';
import { useTopPicks } from '../../../api/productApi';
import { useWishlist } from '../../../hooks/useWishlist.ts';
import { useWishlistIds } from '../../../api/wishlistApi';
import { useAddToCart } from '../../../api/cartApi';
import { useCartStore } from '../../../store/useCartStore';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter.ts';
import { useToast } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { HOMEPAGE_TOP_PICKS_LIMIT } from '../../../constants/display.constants.ts';
import {
  DEFAULT_SORT_OPTION,
  TOP_PICS_SORT_OPTIONS,
} from '../../../constants/filters.constants.ts';
import type { Product } from '../../../api/types/product.ts';
import styles from './top-picks-v2.module.scss';

const ProductRow: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const { isFavorite, isLoading, toggleFavorite } = useWishlist(product);
  const addToCartMutation = useAddToCart();
  const { openShippingCartDrawer } = useCartStore();
  const formatCurrency = useCurrencyFormatter();
  const toast = useToast();
  useWishlistIds();

  const getProductLabel = (p: Product): string => {
    if (p?.outOfStock) return 'Out of stock';
    if ((p?.defaultVariant?.oldPrice || 0) > (p?.defaultVariant?.price || 0)) return 'SALE';
    return '';
  };

  return (
    <ProductCard
      product={product as any}
      direction="horizontal"
      fullWidth
      labelAppearance={product?.outOfStock ? 'secondary' : 'primary'}
      label={getProductLabel(product)}
      formatCurrency={formatCurrency}
      isFavorite={isFavorite}
      onToggleFavorite={async () => {
        await toggleFavorite();
      }}
      isLoadingAddToCart={addToCartMutation.isPending}
      onAddToCart={async (p: any) => {
        if (p?.outOfStock) {
          toast.error('Out of stock');
          return;
        }
        await addToCartMutation.mutateAsync({
          productId: Number(product.id),
          variantId: Number(product?.defaultVariant?.id),
          quantity: 1,
        });
        openShippingCartDrawer();
      }}
      isLoadingFavorite={isLoading}
      onClick={() => navigate(`/product-details/${product.id}`)}
    />
  );
};

const TopPicksV2 = () => {
  const [selected, setSelected] = useState(DEFAULT_SORT_OPTION);
  const navigate = useNavigate();
  const { data: items = [], isLoading } = useTopPicks(selected as any, HOMEPAGE_TOP_PICKS_LIMIT);
  const { t } = useTranslation('common');

  const handleSortChange = useCallback((val: string) => {
    setSelected(val);
  }, []);

  const handleViewAll = useCallback(() => {
    navigate(`/shop?sortBy=${encodeURIComponent(selected)}`);
  }, [navigate, selected]);

  return (
    <div className={styles.section}>
      <Flex justify="between" align="center" fullWidth className={styles.header}>
        <h2 className={styles.title}>{t('home.topPicks.title')}</h2>
        <Button appearance="outline" color="primary" size="medium" onClick={handleViewAll}>
          {t('home.topPicks.viewAll', {
            label: t(`shop.sort.${selected}`, {
              defaultValue: TOP_PICS_SORT_OPTIONS.find((opt) => opt.value === selected)?.label,
            }),
          })}
        </Button>
      </Flex>

      <RadioButtonGroup
        className={styles.filters}
        options={TOP_PICS_SORT_OPTIONS.map((opt) => ({
          ...opt,
          label: t(`shop.sort.${opt.value}`, { defaultValue: opt.label }),
        }))}
        selectedValue={selected}
        name="topPicksV2"
        onChange={handleSortChange}
        appearance="chip"
        justify="start"
      />

      <div className={styles.list}>
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <React.Fragment key={`skeleton-${i}`}>
              <SkeletonProductCard fullWidth />
            </React.Fragment>
          ))}
        {!isLoading &&
          items.map((product, index) => (
            <div
              key={product.id || `product-${index}`}
              className={styles.listItem}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ProductRow product={product} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default TopPicksV2;
