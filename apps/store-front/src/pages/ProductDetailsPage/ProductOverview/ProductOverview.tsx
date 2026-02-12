import React, { useCallback, useMemo, useState } from 'react';
import {
  ImageGallery,
  Flex,
  Heading,
  Rating,
  ExpandableContent,
  Button,
  Card,
  useToast,
  CopyToClipboardButton,
  Tooltip,
  HeartButton,
  SocialIconButton,
  StringInput, Divider,
} from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../../api/settingsApi';
import styles from './product-overview.module.scss';
import { ArrowLeftRight, ShoppingCart } from 'lucide-react';
import clsx from 'clsx';
import { useAddToCart } from '../../../api/cartApi';
import { useWishlist } from '../../../hooks/useWishlist';
import { copyTextToClipboard } from '@baby-toys/ui-kit/utils';
import { useTranslation } from 'react-i18next';
import { socialMediaLinks } from '../../../components/Layout/Footer/footer.constants';
import { useCartStore } from '../../../store/useCartStore';
import { shareProduct, type SharePlatform } from '../../../utils/share';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter';
import VariantOptionsSelector from '../VariantPicker/VariantOptionsSelector.tsx';
import type { Product, Variant } from "../../../api/types/product.ts";

export const ProductOverview: React.FC<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;
  const formatCurrency = useCurrencyFormatter(symbol);

  const addToCartMutation = useAddToCart();
  const { openShippingCartDrawer } = useCartStore();
  const toast = useToast();
  const { t } = useTranslation('common');
  const tooltipKeyByPlatform: Record<string, string> = {
    whatsapp: 'product.tooltips.shareWhatsapp',
    facebook: 'product.tooltips.shareFacebook',
  };
  const { isFavorite, isLoading, toggleFavorite } = useWishlist(product);

  const isAddDisabled = addToCartMutation.isPending || product.outOfStock;

  const variants: Variant[] = product.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(
    product.defaultVariant?.id
  );

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId),
    [variants, selectedVariantId]
  );

  const price = selectedVariant?.price ?? product.defaultVariant?.price;
  const oldPrice = selectedVariant?.oldPrice ?? product.defaultVariant?.oldPrice;
  const maxStock = selectedVariant?.stockQuantity ?? product.activeVariantsTotalStock;

  const handleCopyUrl = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const url = `${window.location.origin}/product-details/${product.id}`;

      copyTextToClipboard(url)
        .then(() => toast.success('Product URL copied to clipboard!'))
        .catch(() => toast.error('Failed to copy URL.'));
    },
    [product.id, toast]
  );

  const handleSocialShare = useCallback(
    (platform: SharePlatform) => {
      shareProduct(platform, product.id);
    },
    [product.id]
  );

  const handleAddToCart = async() => {
    if(!selectedVariant?.id) {
      toast.error(
        t('product.selectVariantFirst', {
          defaultValue: 'Please select a variant',
        })
      );
      return;
    }

    await addToCartMutation.mutateAsync({
      productId: Number(product.id),
      variantId: Number(selectedVariant.id),
      quantity,
    });

    openShippingCartDrawer();
  };

  return (
    <div className={styles.productOverview}>
      <ImageGallery images={product.images} productName={product.name}/>
      <Flex direction="vertical">
        <Heading level="h3" className="bts-marginBxs">{product.name}</Heading>
        {product.productSku && (
          <Flex className={styles.productOverviewSkuLine}>
            <span>
              {t('product.productNumber')}: {product.productSku}
            </span>

            <Tooltip content={t('product.copyProductNumber')}>
              <CopyToClipboardButton
                value={product.productSku}
                successMessage={t('product.productNumberCopied')}
                appearance="link"
                withoutPadding
              />
            </Tooltip>

            <Rating className="bts-marginLm" value={product.averageRating} reviewsCount={product.numberOfRatings || 0}/>
          </Flex>
        )}

        <Heading level="h2" className={clsx('bts-marginBl', oldPrice && styles.productOverviewWithDiscount)}>
          <span className={styles.productOverviewPriceNew}>{formatCurrency(price)}</span>
          {oldPrice && (
            <span className={styles.productOverviewPriceOld}>{formatCurrency(oldPrice)}</span>
          )}
        </Heading>
        <Divider className="bts-marginBxl"/>
        {!!product.options?.length && (
          <VariantOptionsSelector
            className="bts-marginBxxl"
            product={product}
            preselectedVariantId={selectedVariantId}
            onChange={({ variantId }) => setSelectedVariantId(variantId)}
          />
        )}

        <ExpandableContent className="bts-marginBxl bts-marginTs" maxHeight="200px">
          <ul className={styles.productOverviewFeatureBullets}>
            {product.featureBullets?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </ExpandableContent>

        <Flex direction="horizontal" className="bts-marginBxxxl" spacing="s" align="center">
          <span className="bts-marginRs"> {t('common.share')}</span>
          {socialMediaLinks.map(({ icon, platform }) => (
            <Tooltip
              key={platform}
              content={t(tooltipKeyByPlatform[platform] ?? 'product.tooltips.share', {
                defaultValue: 'Share',
              })}
            >
              <SocialIconButton
                icon={icon}
                size="small"
                variant={platform}
                onClick={() => handleSocialShare(platform)}
              />
            </Tooltip>
          ))}
        </Flex>
        <Flex direction="horizontal" spacing="s" align="center"
              className={clsx('bts-marginBxxxl', styles.productOverviewActions)}>
          <StringInput
            type="number"
            min={1}
            max={maxStock}
            withControls
            value={quantity}
            onChange={(val) => setQuantity(Number(val))}
            isDisabled={isAddDisabled}
            maxTooltip={`Only ${maxStock} left in stock`}
          />

          <Button
            leftIconComp={ShoppingCart}
            isDisabled={isAddDisabled}
            isLoading={addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            {product.outOfStock ? t('common.outOfStock') : t('product.addToCart')}
          </Button>

          <HeartButton
            appearance="outline"
            checked={isFavorite}
            isLoading={isLoading}
            disabled={isLoading}
            size="small"
            onToggle={toggleFavorite}
          />

          <Button leftIconComp={ArrowLeftRight} appearance="outline" onClick={handleCopyUrl}/>
        </Flex>

        {!!product.details?.length && (
          <Card fullWidth size="small" header={t('product.details')}>
            <ExpandableContent>
              <div className={styles.productOverviewDetails}>
                {product.details.map(({ label, value }, index) => (
                  <React.Fragment key={`${label}-${index}`}>
                    <label>{label}</label>
                    <span>{value}</span>
                  </React.Fragment>
                ))}
              </div>
            </ExpandableContent>
          </Card>
        )}
      </Flex>
    </div>
  );
};
