import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import styles from './checkout-page.module.scss';
import {
  Alert,
  BouncingDotsLoader,
  Button,
  Card,
  Chip,
  Divider,
  useToast,
} from '@baby-toys/ui-kit';

import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import ShippingForm, { type ShippingFormValues } from './ShippingForm';

import { useAuth } from '../../context/AuthContext.tsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';

import { useStoreSettings } from '../../api/settingsApi';
import { useMyAddresses, usePlaceOrder } from '../../api/orderApi';
import { useCheckoutQuote } from '../../api/checkoutApi';
import { useCartQuery } from '../../api/cartApi';
import type { DeliveryTown } from '../../api/locationsApi';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('common');
  const { isAuthenticated } = useAuth();

  const { data: cart, isPending: cartLoading } = useCartQuery();
  const { data: addresses, isLoading: addressesLoading } = useMyAddresses();
  const { data: settings } = useStoreSettings();
  const placeOrder = usePlaceOrder();

  const formatCurrency = useCurrencyFormatter(settings?.general?.currencySymbol);

  // Local state (inputs that affect quote)
  const [couponCode, setCouponCode] = useState('');
  const [selectedTown, setSelectedTown] = useState<DeliveryTown | null>(null);

  const normalizedCouponCode = couponCode.trim();

  const { data: quote, isPending: isQuoting } = useCheckoutQuote(
    selectedTown?.code,
    normalizedCouponCode
  );

  const view = useMemo(() => {
    const hasCartItems = (cart?.items?.length || 0) > 0;

    const subtotal = quote?.subtotal ?? cart?.subtotal ?? 0;
    const discountAmount = quote?.discountAmount ?? 0;
    const shippingCost = quote?.shippingCost ?? null;
    const total = quote?.total ?? null;

    const couponApplied = !!(quote?.coupon?.valid && quote?.coupon?.code);

    const items = cart?.items || [];
    const hasOOS = items.some((i) => (i.availableStock ?? 0) <= 0);
    const hasOverAllocated = items.some(
      (i) => (i.availableStock ?? 0) > 0 && i.quantity > (i.availableStock ?? 0)
    );
    const stockBlocked = hasOOS || hasOverAllocated;

    return {
      hasCartItems,
      subtotal,
      discountAmount,
      shippingCost,
      total,
      couponApplied,
      hasOOS,
      hasOverAllocated,
      stockBlocked,
      items,
    };
  }, [cart, quote]);

  // Avoid spamming the same invalid-coupon toast on refetch
  const lastCouponToastRef = useRef<string | null>(null);
  useEffect(() => {
    if(!quote) return;

    const invalid = !!normalizedCouponCode && (!quote.coupon || quote.coupon.valid === false);
    if(!invalid) {
      lastCouponToastRef.current = null;
      return;
    }

    const msg = quote.coupon?.message || t('checkout.invalidCoupon');
    if(lastCouponToastRef.current !== msg) {
      toast.error(msg);
      lastCouponToastRef.current = msg;
    }
  }, [quote, normalizedCouponCode, toast, t]);

  const onSubmit = async(values: ShippingFormValues) => {
    try {
      await placeOrder.mutateAsync({
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          town: values.town,
          region: values.region,
          detailedAddress: values.address,
          phoneNumber: values.phone,
          secondPhoneNumber: values.secondPhone?.trim() || undefined,
        },
        saveAddress: values.saveAddress,
        couponCode: values.couponCode?.trim() || undefined,
        townCode: values.townCode || selectedTown?.code || '',
        note: values.note?.trim() || null,
      });

      navigate('/home');
    } catch {
      toast.error(t('checkout.placeOrderFailed'));
    }
  };

  return (
    <PageContainer isLoading={cartLoading || addressesLoading} isMaskLoading={placeOrder.isPending}>
      <div className={clsx(styles.checkoutPage, view.stockBlocked && styles.stockBlocked)}>
        {view.hasOOS && (
          <Alert appearance="error" className={styles.alert}>
            {t('cart.removeOOSGlobal')}
            <Button appearance="link" color="underline" onClick={() => navigate('/shopping-cart')}>
              {t('cart.goToCart', { defaultValue: 'Go to cart' })}
            </Button>
          </Alert>
        )}

        {view.hasOverAllocated && (
          <Alert appearance="error" className={styles.alert}>
            {t('cart.reduceQtyGlobal')}
            <Button appearance="link" color="underline" onClick={() => navigate('/shopping-cart')}>
              {t('cart.goToCart', { defaultValue: 'Go to cart' })}
            </Button>
          </Alert>
        )}

        <Card fullWidth header={t('checkout.shippingInfo')}>
          <ShippingForm
            isAuthenticated={isAuthenticated}
            addresses={addresses}
            onSubmit={onSubmit}
            placing={placeOrder.isPending}
            disableSubmit={!view.hasCartItems || cartLoading || addressesLoading}
            stockBlocked={view.stockBlocked}
            onAlterCart={() => navigate('/shopping-cart')}
            onCouponPreview={({ code }) => setCouponCode(code.trim())}
            couponValid={quote?.coupon?.valid ?? null}
            onTownChange={setSelectedTown}
          />
        </Card>

        <Card className={styles.checkoutPageSummary} fullWidth header={t('checkout.cartSummary')}>
          <div className={styles.checkoutPageSummaryList}>
            {view.items.map((item) => (
              <div className={styles.checkoutPageSummaryItem} key={item.id}>
                <img src={item.productImage || ''} alt={item.productName}/>
                <div>
                  <div className={styles.checkoutPageSummaryItemName}>{item.productName}</div>
                  <div className="bts-paddingTs">x{item.quantity}</div>
                </div>
                <div>{formatCurrency(item.totalPrice)}</div>
                <Divider className="bts-marginBl" fullWidth/>
              </div>
            ))}
          </div>

          <div className={styles.checkoutPageSummaryRow}>
            <span>{t('common.subtotal')}</span>
            <span>{formatCurrency(view.subtotal)}</span>
          </div>

          {view.couponApplied && view.discountAmount > 0 && (
            <div className={styles.checkoutPageSummaryRow}>
              <span>{t('checkout.discount')}</span>
              <span>-{formatCurrency(view.discountAmount)}</span>
            </div>
          )}

          <div className={styles.checkoutPageSummaryRow}>
            <span>
              {t('checkout.shipping')}{' '}
              {quote?.isFreeShipping && (
                <Chip
                  label={t('checkout.freeShippingApplied')}
                  appearance="success"
                  size="small"
                />
              )}
            </span>
            <span>
              {view.shippingCost == null ? '-' : formatCurrency(view.shippingCost)}
            </span>
          </div>

          <Divider className="bts-marginBl"/>

          <div className={`${styles.checkoutPageSummaryRow} ${styles.checkoutPageSummaryRowTotal}`}>
            <span>{t('checkout.total')}</span>
            <span>
              {isQuoting ? <BouncingDotsLoader size="small"/> : formatCurrency(view.total)}
            </span>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CheckoutPage;
