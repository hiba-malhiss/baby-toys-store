import Drawer from '../../common/Drawer/Drawer';
import { Divider } from '../../common/Divider/Divider.tsx';
import CartItemCard from '../../common/CartItemCard/CartItemCard.tsx';
import { cartItems, currency, shippingCost } from '../../../mock-data/shipping-page.ts';
import Flex from '../../common/Flex/Flex.tsx';
import { Button } from '../../common/Button/Button.tsx';
import { calculateOrderSummary } from '../../../util/order.utils.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ShoppingCartDrawer = ({ isOpen, setIsOpen }: ShoppingCartDrawerProps) => {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<number[]>(cartItems.map((item) => item.amount));
  const { subtotal } = calculateOrderSummary(cartItems, shippingCost);

  const handleAmountChange = (index: number, newVal: string) => {
    const updated = [...quantities];
    updated[index] = Math.max(parseInt(newVal) || 1, 1);
    setQuantities(updated);
  };

  return (
    <Drawer
      visible={isOpen}
      header="Order Summary"
      position="right"
      onClose={() => setIsOpen(false)}
      footer={
        <>
          <Flex fullWidth justify="between" className="bts-marginBxl">
            <span>Subtotal</span>
            <span>
              {subtotal}
              {currency}
            </span>
          </Flex>
          <Button onClick={() => navigate('/shopping-cart')} fullWidth className="bts-marginTl">
            Place order
          </Button>
          <Button
            onClick={() => navigate('/shopping-cart')}
            fullWidth
            color="secondary-light"
            className="bts-marginTl"
          >
            Go To Shipping Cart
          </Button>
        </>
      }
    >
      <Flex direction="vertical" spacing="l" fullWidth>
        {cartItems.map((item, index) => (
          <>
            <CartItemCard
              fullWidth
              key={index}
              image={item.image}
              name={item.name}
              price={item.price}
              amount={quantities[index]}
              onAmountChange={(val) => handleAmountChange(index, val)}
            />
            <Divider />
          </>
        ))}
      </Flex>
    </Drawer>
  );
};

export default ShoppingCartDrawer;
