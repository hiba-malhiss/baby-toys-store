import { Alert } from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../api/settingsApi.ts';
import { useCartQuery } from '../../api/cartApi.ts';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FreeShippingBanner = () => {
  const { data: settings } = useStoreSettings();
  const { data: cart } = useCartQuery();
  const { pathname } = useLocation();
  const { t } = useTranslation('common');

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
          {t('freeShipping.unlocked')}
        </Alert>
      );
    }

    if (cart.freeShippingRemaining > 0) {
      return (
        <Alert key={pathname} appearance="flash-sale" size="small" justify="center">
          {t('freeShipping.addMore', { amount: fmt.format(cart.freeShippingRemaining) })}
        </Alert>
      );
    }
  }

  return (
    <Alert key={pathname} size="small" appearance="flash-sale" justify="center">
      {t('freeShipping.overThreshold', { amount: fmt.format(minSubtotal) })}
    </Alert>
  );
};

export default FreeShippingBanner;
