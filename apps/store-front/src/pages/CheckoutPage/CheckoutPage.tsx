import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './checkout-page.module.scss';

import { Card, Divider, useToast } from '@baby-toys/ui-kit';

import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import ShippingForm, { type ShippingFormValues } from './ShippingForm';

import { useAuth } from '../../context/AuthContext.tsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';

import { useStoreSettings } from '../../api/settingsApi';
import { useMyAddresses, usePlaceOrder } from '../../api/orderApi';
import { useCheckoutQuote, type QuoteResponse } from '../../api/checkoutApi';
import { useCartQuery } from '../../api/cartApi';

const CheckoutPage: React.FC = () => {
  const { data: cart, isPending: cartLoading } = useCartQuery();
  const { data: addresses, isPending: addressesLoading } = useMyAddresses();
  const { data: settings } = useStoreSettings();

  const placeOrder = usePlaceOrder();
  const quoteMutation = useCheckoutQuote();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const symbol = settings?.general?.currencySymbol;
  const formatCurrency = useCurrencyFormatter(symbol);

  // Local state
  const [couponCode, setCouponCode] = useState('');
  const [selectedShipping, setSelectedShipping] = useState<{ id: number; cost: number } | null>(
    null
  );
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  // Derived values
  const hasCartItems = (cart?.items?.length || 0) > 0;
  const subtotal = quote?.subtotal ?? cart?.subtotal ?? 0;
  const shippingCost = quote?.shippingCost ?? null;
  const discountAmount = quote?.discountAmount ?? 0;
  const total = quote?.total ?? null;
  const couponApplied = !!(quote?.coupon?.valid && quote?.coupon?.code);

  // Handlers
  const refreshQuote = (shippingId?: number, code?: string) => {
    if (!shippingId) return setQuote(null);
    quoteMutation.mutate(
      { shippingOptionId: shippingId, couponCode: code || undefined },
      {
        onSuccess: (resp) => {
          setQuote(resp);
          // If user provided a code and backend says invalid, inform via toast
          if (code && (!resp.coupon || resp.coupon.valid === false)) {
            toast.error(resp.coupon?.message || 'Invalid coupon');
          }
        },
        onError: () => {
          setQuote(null);
          if (code) toast.error('Failed to validate coupon');
        },
      }
    );
  };

  const handleCouponPreview = (info: { code: string }) => {
    const code = info.code.trim();
    setCouponCode(code);
    refreshQuote(selectedShipping?.id, code);
  };

  const handleShippingChange = useCallback(
    (opt: { id: number; cost: number } | null) => {
      const sel = opt ? { id: opt.id, cost: Number(opt.cost) } : null;
      setSelectedShipping(sel);
      refreshQuote(sel?.id, couponCode);
    },
    [couponCode]
  );

  const onSubmit = async (values: ShippingFormValues) => {
    try {
      await placeOrder.mutateAsync({
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          town: values.town,
          region: values.region,
          detailedAddress: values.address,
          phoneNumber: values.phone,
        },
        saveAddress: values.saveAddress,
        couponCode: values.couponCode?.trim() || undefined,
        shippingOptionId: values.shippingOptionId ?? selectedShipping?.id,
      });
      navigate('/home');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <PageContainer isLoading={cartLoading || addressesLoading} isMaskLoading={placeOrder.isPending}>
      <div className={styles.checkoutPage}>
        {/* Shipping Info */}
        <Card fullWidth header="Shipping Information">
          <ShippingForm
            isAuthenticated={isAuthenticated}
            addresses={addresses}
            onSubmit={onSubmit}
            placing={placeOrder.isPending}
            disableSubmit={!hasCartItems || cartLoading || addressesLoading}
            onCouponPreview={handleCouponPreview}
            couponValid={quote?.coupon?.valid ?? null}
            onShippingOptionChange={handleShippingChange}
          />
        </Card>

        {/* Cart Summary */}
        <Card className={styles.checkoutPageSummary} fullWidth header="Your Shopping Cart">
          <div className={styles.checkoutPageSummaryList}>
            {cart?.items?.map((item) => (
              <div className={styles.checkoutPageSummaryItem} key={item.id}>
                <img src={item.productImage || ''} alt={item.productName} />
                <div>
                  <div className={styles.checkoutPageSummaryItemName}>{item.productName}</div>
                  <div className="bts-paddingTs">x{item.quantity}</div>
                </div>
                <div>{formatCurrency(item.totalPrice)}</div>
                <Divider fullWidth />
              </div>
            ))}
          </div>

          <div className={styles.checkoutPageSummaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {couponApplied && discountAmount > 0 && (
            <div className={styles.checkoutPageSummaryRow}>
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className={styles.checkoutPageSummaryRow}>
            <span>Shipping</span>
            <span>{shippingCost == null ? '-' : formatCurrency(shippingCost)}</span>
          </div>
          <Divider className="bts-marginBl" />
          <div className={`${styles.checkoutPageSummaryRow} ${styles.checkoutPageSummaryRowTotal}`}>
            <span>Total</span>
            <span>{total == null ? '-' : formatCurrency(total)}</span>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CheckoutPage;
