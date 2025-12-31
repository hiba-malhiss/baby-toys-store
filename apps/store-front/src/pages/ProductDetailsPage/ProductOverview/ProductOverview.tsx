import React, { useCallback, useState } from 'react';
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
} from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../../api/settingsApi';
import styles from './product-overview.module.scss';
import { faRightLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useAddToCart } from '../../../api/cartApi';
import { useWishlist } from '../../../hooks/useWishlist.ts';
import { StringInput } from '@baby-toys/ui-kit';
import { copyTextToClipboard } from '@baby-toys/ui-kit/utils';
import { useTranslation } from 'react-i18next';
import { socialMediaLinks } from '../../../components/Layout/Footer/footer.constants.ts';
import type { UiProduct } from '../../../api/normalizers/productNormalizer.ts';
import { useCartStore } from '../../../store/useCartStore';
import { shareProduct } from '../../../utils/share.ts';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter.ts';

export const ProductOverview: React.FC<{ product: UiProduct }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;
  const addToCartMutation = useAddToCart();
  const { openShippingCartDrawer } = useCartStore();
  const toast = useToast();
  const formatCurrency = useCurrencyFormatter(symbol);
  const { t } = useTranslation('common');

  const tooltipKeyByIcon: Record<string, string> = {
    'whatsapp': 'product.tooltips.shareWhatsapp',
    'facebook-f': 'product.tooltips.shareFacebook',
  };

  // Use favorite hook here for this product
  const { isFavorite, isLoading, toggleFavorite } = useWishlist(product);

  const handleCopyUrl = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const urlToCopy = `${window.location.origin}/product-details/${product.id}`;

      copyTextToClipboard(urlToCopy)
        .then(() => {
          toast.success('Product URL copied to clipboard!');
        })
        .catch(() => {
          toast.error('Failed to copy URL.');
        });
    },
    [product.id, toast]
  );

  const handleSocialShare = useCallback(
    (iconName: string) => {
      if(iconName === 'whatsapp') {
        shareProduct('whatsapp', product.id);
        return;
      }
      if(iconName === 'facebook-f') {
        shareProduct('facebook', product.id);
        return;
      }
    },
    [product.id]
  );

  return (
    <div className={styles.productOverview}>
      <ImageGallery images={product.images} productName={product.name}/>
      <Flex direction="vertical">
        <Heading level="h3" className="bts-marginBxs">
          {product.name}
        </Heading>
        {product.productSku && (
          <Flex className={styles.productOverviewSkuLine}>
            <span>{t('product.productNumber', { defaultValue: 'Product Number' })}: {product.productSku}</span>
            <Tooltip content={t('product.copyProductNumber', { defaultValue: 'Copy product number' })}>
              <CopyToClipboardButton
                value={product.productSku}
                successMessage={t('product.productNumberCopied', { defaultValue: 'Product number copied' })}
                ariaLabel={t('product.copyProductNumber', { defaultValue: 'Copy product number' })}
                appearance="link"
                withoutPadding
              />
            </Tooltip>
            <Rating value={product.rating} reviewsCount={product.numberOfRatings || 0} className="bts-marginLm"/>
          </Flex>
        )}
        <Heading
          level="h2"
          className={clsx('bts-marginBl', product.oldPrice && styles.productOverviewWithDiscount)}
        >
          <span className={styles.productOverviewPriceNew}>{formatCurrency(product.price)}</span>
          {product.oldPrice && (
            <span className={styles.productOverviewPriceOld}>
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </Heading>
        <ExpandableContent className="bts-marginBxxl bts-marginTs" maxHeight="200px">
          <ul className={styles.productOverviewFeatureBullets}>
            {product.featureBullets?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </ExpandableContent>
        <Flex direction="horizontal" className="bts-marginBxxxl" spacing="s" align="center">
          <span className="bts-marginRs"> {t('common.share')}</span>
          {socialMediaLinks.map(({ icon }) => (
            <Tooltip
              key={icon.iconName}
              content={t(tooltipKeyByIcon[icon.iconName] ?? 'product.tooltips.share', {
                defaultValue: 'Share',
              })}
            >
              <SocialIconButton
                icon={icon}
                size="small"
                onClick={() => handleSocialShare(icon.iconName)}
              />
            </Tooltip>
          ))}
        </Flex>
        <Flex
          direction="horizontal"
          className={clsx('bts-marginBxxxl', styles.productOverviewActions)}
          spacing="s"
          align="center"
        >
          <StringInput
            type="number"
            min={1}
            max={product.availableInStock}
            withControls
            value={quantity}
            onChange={(val) => setQuantity(Number(val))}
            isDisabled={addToCartMutation.isPending || product.outOfStock}
            maxTooltip={`Only ${product.availableInStock} left in stock`}
          />
          <Button
            leftIcon={faShoppingCart}
            isDisabled={addToCartMutation.isPending || product.outOfStock}
            isLoading={addToCartMutation.isPending}
            onClick={async () => {
              await addToCartMutation.mutateAsync({ productId: Number(product.id), quantity });
              openShippingCartDrawer();
            }}
            aria-label={product.outOfStock ? 'Out of stock' : t('product.addToCart')}
          >
            {product.outOfStock
              ? t('common.outOfStock', { defaultValue: 'Out of stock' })
              : t('product.addToCart')}
          </Button>
          <Tooltip
            content={
              isFavorite
                ? t('product.tooltips.removeFromFavorites', { defaultValue: 'Remove from favorites' })
                : t('product.tooltips.addToFavorites', { defaultValue: 'Add to favorites' })
            }
          >
            <HeartButton
              appearance="outline"
              checked={isFavorite}
              isLoading={isLoading}
              disabled={isLoading}
              size="small"
              ariaLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onToggle={() => toggleFavorite()}
            />
          </Tooltip>

          <Tooltip content={t('product.tooltips.copyLink', { defaultValue: 'Copy product link' })}>
            <Button
              leftIcon={faRightLeft}
              appearance="outline"
              onClick={handleCopyUrl}
            />
          </Tooltip>
        </Flex>
        {!!product.details?.length && (
          <Card fullWidth size="small" header={t('product.details')}>
            <ExpandableContent>
              <div className={styles.productOverviewDetails}>
                {product.details?.map(({ label, value }, index) => (
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
