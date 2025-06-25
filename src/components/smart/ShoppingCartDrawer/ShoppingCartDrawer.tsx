import Drawer from '../../common/Drawer/Drawer';
import { Divider } from '../../common/Divider/Divider.tsx';
import CartItemCard from '../../common/CartItemCard/CartItemCard.tsx';
import { currency, shippingCost } from '../../../mock-data/shipping-page.ts';
import Flex from '../../common/Flex/Flex.tsx';
import { Button } from '../../common/Button/Button.tsx';
import { calculateOrderSummary } from '../../../util/order.utils.ts';
import { useCartStore } from '../../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ShoppingCartDrawer = ({ isOpen, setIsOpen }: ShoppingCartDrawerProps) => {
  const navigate = useNavigate();
  const { items: cartItems, updateQuantity, closeShippingCartDrawer } = useCartStore();

  const { subtotal } = calculateOrderSummary(cartItems, shippingCost);

  const handleAmountChange = (productId: string, newVal: string) => {
    const newQuantity = Math.max(parseInt(newVal) || 1, 1);
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

  return (
    <Drawer
      visible={isOpen}
      header="Order Summary"
      position="right"
      onClose={handleClose}
      footer={
        <>
          <Flex fullWidth justify="between" className="bts-marginBxl">
            <span>Subtotal</span>
            <span>
              {subtotal}
              {currency}
            </span>
          </Flex>
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
      }
    >
      <Flex direction="vertical" spacing="l" fullWidth>
        {cartItems.map((item, index) => (
          <React.Fragment key={item.productId}>
            <CartItemCard
              fullWidth
              image={item.mainImage || ''}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              onAmountChange={(val) => handleAmountChange(item.productId, val)}
            />
            {index < cartItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Flex>
    </Drawer>
  );
};

export default ShoppingCartDrawer;
