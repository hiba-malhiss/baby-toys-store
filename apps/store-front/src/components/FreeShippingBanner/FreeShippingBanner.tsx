import { Alert } from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../api/settingsApi.ts';
import { useCartQuery } from '../../api/cartApi.ts';
import { useLocation } from 'react-router-dom';

const FreeShippingBanner = () => {
  const { data: settings } = useStoreSettings();
  const { data: cart } = useCartQuery();
  const { pathname } = useLocation();

  if (!settings || !cart) return null;

  const minSubtotal = settings?.policies?.freeShippingMinSubtotal || 0;

  const fmt = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: settings?.general?.currency || 'USD',
  });

  const isCartOrCheckout = pathname.includes('cart') || pathname.includes('checkout');

  if (isCartOrCheckout) {
    if (cart?.freeShippingApplied) {
      return (
        <Alert key={pathname} appearance="success" size="small" justify="center">
          🎉 You’ve unlocked free shipping!
        </Alert>
      );
    }

    if (cart.freeShippingRemaining > 0) {
      return (
        <Alert key={pathname} appearance="flash-sale" size="small" justify="center">
          Add {fmt.format(cart.freeShippingRemaining)} more to unlock free shipping 🚚
        </Alert>
      );
    }
  }

  return (
    <Alert key={pathname} size="small" appearance="flash-sale" justify="center">
      Free shipping on orders over {fmt.format(minSubtotal)} 🚚
    </Alert>
  );
};

export default FreeShippingBanner;
