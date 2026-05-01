import React, { useCallback, useMemo, useState } from 'react';
import {
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
  StringInput,
  Divider,
  Text,
} from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../../api/settingsApi';
import styles from './product-overview.module.scss';
import { ArrowLeftRight, ShoppingCart, Share2 } from 'lucide-react';
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
import type { Product, Variant } from '../../../api/types/product.ts';
import { ProductImageGallery } from '@baby-toys/ui-kit';

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
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    product.defaultVariant?.mainImage ?? product.images?.[0]
  );

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId),
    [variants, selectedVariantId]
  );

  const handleVariantChange = ({ variantId }: { variantId: number }) => {
    setSelectedVariantId(variantId);
    const variant = variants.find((v) => v.id === variantId);
    if (variant?.mainImage) {
      setSelectedImage(variant.mainImage);
    }
  };

  const price = selectedVariant?.price;
  const oldPrice = selectedVariant?.oldPrice;
  const maxStock = selectedVariant?.stockQuantity;

  // Deduplicate images, keep mainImage last (as fallback)
  const allImages = useMemo(() => {
    const imgs = [...(product.images || [])];
    if (product.mainImage && !imgs.includes(product.mainImage)) {
      imgs.push(product.mainImage);
    }
    return imgs.filter(Boolean) as string[];
  }, [product.images, product.mainImage]);

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

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
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

  const discountPercent =
    price && oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  return (
    <div className={styles.productOverview}>
      {/* Gallery column */}
      <div className={styles.productOverviewGalleryCol}>
        <ProductImageGallery
          images={allImages}
          productName={product.name}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
        />
      </div>

      {/* Info column */}
      <Flex direction="vertical" className={styles.productOverviewInfoCol}>
        <Heading level="h3" className={styles.productOverviewTitle}>
          {product.name}
        </Heading>

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
            <Rating
              className={styles.productOverviewRating}
              value={product.averageRating}
              reviewsCount={product.numberOfRatings || 0}
            />
          </Flex>
        )}

        {/* Price block */}
        <div
          className={clsx(
            styles.productOverviewPriceBlock,
            oldPrice && styles.productOverviewWithDiscount
          )}
        >
          <span className={styles.productOverviewPriceNew}>{formatCurrency(price)}</span>
          {oldPrice && (
            <span className={styles.productOverviewPriceOld}>{formatCurrency(oldPrice)}</span>
          )}
          {discountPercent && (
            <span className={styles.productOverviewDiscountBadge}>-{discountPercent}%</span>
          )}
        </div>

        <Divider className={styles.productOverviewDivider} />

        {!!product.options?.length && (
          <>
            <VariantOptionsSelector
              className={styles.productOverviewVariants}
              product={product}
              preselectedVariantId={selectedVariantId}
              onChange={handleVariantChange}
            />
            <Divider className={styles.productOverviewDivider} />
          </>
        )}

        {/* Feature bullets */}
        {!!product.featureBullets?.length && (
          <ExpandableContent className={styles.productOverviewBulletsWrap} maxHeight="200px">
            <Text weight="semibold" size="sm" className={styles.productOverviewBulletsLabel}>
              {t('product.aboutThisItem')}
            </Text>
            <ul className={styles.productOverviewFeatureBullets}>
              {product.featureBullets.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </ExpandableContent>
        )}

        {/* Social share row */}
        <Flex
          direction="horizontal"
          className={styles.productOverviewShareRow}
          spacing="s"
          align="center"
        >
          <Share2 size={14} className={styles.productOverviewShareIcon} />
          <span className={styles.productOverviewShareLabel}>{t('common.share')}</span>
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

        {/* Cart actions */}
        <Flex
          direction="horizontal"
          spacing="s"
          align="center"
          className={clsx(styles.productOverviewActions)}
        >
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
            fullWidth
            className={styles.productOverviewAddBtn}
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

          <Tooltip content={t('product.copyLink', { defaultValue: 'Copy link' })}>
            <Button leftIconComp={ArrowLeftRight} appearance="outline" onClick={handleCopyUrl} />
          </Tooltip>
        </Flex>

        {/* Stock status */}
        {maxStock !== undefined && maxStock <= 5 && maxStock > 0 && (
          <span className={styles.productOverviewLowStock}>
            ⚡ {t('product.onlyLeft', { count: maxStock, defaultValue: `Only ${maxStock} left!` })}
          </span>
        )}

        {/* Details card */}
        {!!product.details?.length && (
          <Card
            fullWidth
            size="small"
            header={t('product.details')}
            className={styles.productOverviewDetailsCard}
          >
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
