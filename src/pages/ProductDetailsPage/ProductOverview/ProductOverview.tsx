import { ImageGallery } from '../../../components/common/ImageGallery/ImageGallery.tsx';
import Flex from '../../../components/common/Flex/Flex.tsx';
import Heading from '../../../components/common/Heading/Heading.tsx';
import Rating from '../../../components/common/Rating/Rating.tsx';
import ExpandableContent from '../../../components/common/ExpandableContent/ExpandableContent.tsx';
import { socialMediaLinks } from '../../../components/layout/Footer/footer.constants.ts';
import { Button } from '../../../components/common/Button/Button.tsx';
import Card from '../../../components/common/Card/Card.tsx';
import type { Product } from '../../../types/product.types.ts';
import styles from './product-overview.module.scss';
import { faHeart, faRightLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import clsx from 'clsx';
import { StringInput } from '../../../components/common/StringInput/StringInput.tsx';
import { useCartStore } from '../../../store/useCartStore.ts';
import { useFavoritesStore } from '../../../store/useFavoritesStore.ts';
import { useToast } from '../../../components/common/Toast/ToastContext.tsx';

export const ProductOverview: React.FC<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const toast = useToast();

  return (
    <div className={styles.productOverview}>
      <ImageGallery images={product.images} productName={product.name}></ImageGallery>
      <Flex direction="vertical">
        <Heading level="h2" className="bts-marginBxxl">
          {product.name}
        </Heading>
        <Heading
          level="h2"
          className={clsx('bts-marginBl', product.oldPrice && styles.productOverviewWithDiscount)}
        >
          <span className={styles.productOverviewPriceNew}>{product.price + product.currency}</span>
          {product.oldPrice && (
            <span className={styles.productOverviewPriceOld}>
              {product.oldPrice + product.currency}
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
          <StringInput
            type="number"
            withControls
            min={1}
            value={quantity}
            onChange={(val) => setQuantity(Number(val))}
          />
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
            isSelected={isFavorite(product.id)}
            onClick={() => toggleFavorite(product.id)}
          ></Button>
          <Button leftIcon={faRightLeft} appearance="outline"></Button>
        </Flex>
        <Card fullWidth size="small">
          <Heading level="h3">Item details</Heading>
          <ExpandableContent>
            <div className={styles.productOverviewDetails}>
              {product.details?.map(({ label, value }) => (
                <>
                  <label>{label}</label>
                  <span>{value}</span>
                </>
              ))}
            </div>
          </ExpandableContent>
        </Card>
      </Flex>
    </div>
  );
};
