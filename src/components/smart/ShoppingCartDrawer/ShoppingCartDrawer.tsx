import { useStoreConfiguration } from '../../../context/StoreConfigurationContext.tsx';
import Drawer from '../../common/Drawer/Drawer';
import { Divider } from '../../common/Divider/Divider.tsx';
import CartItemCard from '../../common/CartItemCard/CartItemCard.tsx';
import Flex from '../../common/Flex/Flex.tsx';
import { Button } from '../../common/Button/Button.tsx';
import { calculateOrderSummary } from '../../../util/order.utils.ts';
import { formatQuantity } from '../../../util/format.utils.ts';
import { useCartStore } from '../../../store/useCartStore';
import { useCartSync } from '../../../hooks/useCartSync';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { EmptyPlaceholder } from '../../common/EmptyPlaceholder/EmptyPlaceholder.tsx';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './shopping-cart-drawer.module.scss';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ShoppingCartDrawer = ({ isOpen, setIsOpen }: ShoppingCartDrawerProps) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, closeShippingCartDrawer } = useCartStore();
  const { currency, shipping, loading } = useStoreConfiguration();
  useCartSync();

  // Calculate order summary with proper shipping settings
  const { subtotal, isFreeShipping } = calculateOrderSummary(cartItems, shipping);

  const handleAmountChange = (productId: string, newVal: string) => {
    const newQuantity = formatQuantity(newVal);
    updateQuantity(productId, newQuantity);
  };

  const handleClose = () => {
    closeShippingCartDrawer();
    setIsOpen(false);
  };

  const handlePlaceOrder = () => {
    navigate('/shopping-cart');
    handleClose();
  };

  const handleContinueShopping = () => {
    closeShippingCartDrawer();
    navigate('/shop');
    setIsOpen(false);
  };

  if (loading || !currency || !shipping) {
    return (
      <Drawer visible={isOpen} header="Order Summary" position="right" onClose={handleClose}>
        <div>Loading cart...</div>
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
        cartItems.length > 0 && (
          <>
            <Flex fullWidth justify="between" className={clsx('bts-marginBxl', styles.subtotalRow)}>
              <span>Subtotal</span>
              <span>
                {currency.symbol}
                {subtotal}
              </span>
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
        {cartItems.map((item, index) => (
          <React.Fragment key={item.productId}>
            <CartItemCard
              fullWidth
              id={item.productId}
              image={item.mainImage || ''}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              onAmountChange={(val) => handleAmountChange(item.productId, val)}
              onRemove={() => removeFromCart(item.productId)}
            />
            {index < cartItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {cartItems.length === 0 && (
          <div className={styles.emptyCartContainer}>
            <EmptyPlaceholder
              icon={faShoppingCart}
              message="Your cart is empty!"
              buttonText="Continue Shopping"
              onButtonClick={handleContinueShopping}
            />
          </div>
        )}
      </Flex>
    </Drawer>
  );
};

export default ShoppingCartDrawer;
