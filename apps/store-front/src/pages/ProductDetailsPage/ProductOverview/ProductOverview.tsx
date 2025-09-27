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
} from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../../api/settingsApi';
import styles from './product-overview.module.scss';
import { faHeart, faRightLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useCartStore } from '../../../store/useCartStore';
import { useWishlist } from '../../../hooks/useWishlist.ts';
import { ProductQuantityInput } from '@baby-toys/ui-kit';
import { copyTextToClipboard } from '@baby-toys/ui-kit/utils';
import { socialMediaLinks } from '../../../components/layout/Footer/footer.constants.ts';
import type { UiProduct } from '../../../api/normalizers/productNormalizer.ts';

export const ProductOverview: React.FC<{ product: UiProduct }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;
  const { addToCart } = useCartStore();
  const toast = useToast();

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

  return (
    <div className={styles.productOverview}>
      <ImageGallery images={product.images} productName={product.name} />
      <Flex direction="vertical">
        <Heading level="h2" className="bts-marginBxxl">
          {product.name}
        </Heading>
        <Heading
          level="h2"
          className={clsx('bts-marginBl', product.oldPrice && styles.productOverviewWithDiscount)}
        >
          <span className={styles.productOverviewPriceNew}>
            {symbol ? `${symbol}${product.price}` : product.price}
          </span>
          {product.oldPrice && (
            <span className={styles.productOverviewPriceOld}>
              {symbol ? `${symbol}${product.oldPrice}` : product.oldPrice}
            </span>
          )}
        </Heading>
        <Flex spacing="s" className="bts-marginBxxl">
          <Rating value={product.rating} /> ({product.numberOfRatings || 0})
        </Flex>
        <ExpandableContent className="bts-marginBxxl bts-marginTs" maxHeight="200px">
          <ul className={styles.productOverviewFeatureBullets}>
            {product.featureBullets?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </ExpandableContent>
        <Flex direction="horizontal" className="bts-marginBxxxl" spacing="s" align="center">
          <span className="bts-marginRs">Share this:</span>
          {socialMediaLinks.map(({ icon, url }) => (
            <Button
              size="small"
              color="secondary"
              key={icon.iconName}
              leftIcon={icon}
              isRounded
              onClick={() => console.log(url)}
            />
          ))}
        </Flex>
        <Flex direction="horizontal" className="bts-marginBxxxl" spacing="s" align="center">
          <ProductQuantityInput
            availableInStock={product.availableInStock}
            quantity={quantity}
            onChange={(val) => setQuantity(Number(val))}
          ></ProductQuantityInput>
          <Button
            leftIcon={faShoppingCart}
            onClick={() => {
              addToCart(product, quantity);
              toast.success('Added to cart!');
            }}
          >
            Add to cart
          </Button>
          <Button
            leftIcon={faHeart}
            appearance="outline"
            color="icon"
            isSelected={isFavorite}
            isLoading={isLoading}
            onClick={() => toggleFavorite()}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          />

          <Button leftIcon={faRightLeft} appearance="outline" onClick={handleCopyUrl} />
        </Flex>
        {product.details?.length && (
          <Card fullWidth size="small" header="Item details">
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
