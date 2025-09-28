import React from 'react';
import { useNavigate } from 'react-router-dom';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { Drawer, Divider, Flex, Button, NoDataFound, BouncingDotsLoader } from '@baby-toys/ui-kit';
import styles from './shopping-cart-drawer.module.scss';
import CartItemCard from '../CartItemCard/CartItemCard.tsx';
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter.ts';
import { useCartQuery, CART_KEYS } from '../../../api/cartApi';
import { useStoreSettings } from '../../../api/settingsApi';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ShoppingCartDrawer = ({ isOpen, setIsOpen }: ShoppingCartDrawerProps) => {
  const navigate = useNavigate();
  const { data: cart, isPending } = useCartQuery();
  const isCartSyncing = useIsFetching({ queryKey: [CART_KEYS.cart] }) > 0;
  const isAddCartSyncing =
    useIsMutating({ mutationKey: [CART_KEYS.addToCart, CART_KEYS.updateCartItem] }) > 0;
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;
  const formatCurrency = useCurrencyFormatter(symbol);
  const subtotal = cart?.subtotal ?? 0;
  const isFreeShipping = (cart?.shipping ?? 0) === 0;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handlePlaceOrder = () => {
    navigate('/checkout');
    handleClose();
  };

  if (isPending) {
    return (
      <Drawer visible={isOpen} header="Order Summary" position="right" onClose={handleClose}>
        <BouncingDotsLoader />
      </Drawer>
    );
  }

  return (
    <Drawer
      visible={isOpen}
      header="Order Summary"
      position="right"
      onClose={handleClose}
      footer={
        (cart?.items?.length || 0) > 0 && (
          <>
            <Flex fullWidth justify="between" className={clsx('bts-marginBxl', styles.subtotalRow)}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </Flex>
            {isFreeShipping && (
              <Flex fullWidth justify="center" className="bts-marginBs">
                <span className={styles.freeShippingIndicator}>Free shipping applied!</span>
              </Flex>
            )}
            <Button onClick={handlePlaceOrder} fullWidth className="bts-marginTl">
              Place order
            </Button>
            <Button
              onClick={() => {
                navigate('/shopping-cart');
                handleClose();
              }}
              fullWidth
              color="secondary-light"
              className="bts-marginTl"
            >
              Go To Shopping Cart
            </Button>
          </>
        )
      }
    >
      <Flex direction="vertical" spacing="l" fullWidth className={styles.drawerContent}>
        {(cart?.items || []).map((item, index) => (
          <React.Fragment key={item.productId}>
            <CartItemCard
              fullWidth
              id={item.id as any}
              image={item.productImage || ''}
              name={item.productName}
              totalPrice={formatCurrency(item.totalPrice)}
              quantityInStock={item.availableStock}
              quantity={item.quantity}
            />
            {index < (cart?.items?.length || 0) - 1 && <Divider />}
          </React.Fragment>
        ))}
        {(cart?.items?.length || 0) === 0 && (
          <NoDataFound withoutPadding icon={faShoppingCart} message="Oops! No toys here..." />
        )}
        {(isCartSyncing || isAddCartSyncing) && (
          <div className={styles.drawerOverlay}>
            <BouncingDotsLoader />
          </div>
        )}
      </Flex>
    </Drawer>
  );
};

export default ShoppingCartDrawer;
