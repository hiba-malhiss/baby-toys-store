import { useStoreSettings } from '../../api/settingsApi';
import React, { useState } from 'react';
import styles from './checkout-page.module.scss';
import { Card, useToast } from '@baby-toys/ui-kit';
import { useMyAddresses, usePlaceOrder } from '../../api/orderApi';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@baby-toys/ui-kit';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCartQuery } from '../../api/cartApi';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import ShippingForm, { type ShippingFormValues } from './ShippingForm';
import clsx from 'clsx';

const CheckoutPage: React.FC = () => {
  const { data: cart, isPending } = useCartQuery();
  const { data: addresses, isPending: isAddressesPending } = useMyAddresses();
  const placeOrderMutation = usePlaceOrder();
  const { isAuthenticated } = useAuth();
  const [previewDiscount, setPreviewDiscount] = useState<number>(0);
  const [previewTotal, setPreviewTotal] = useState<number | null>(null);
  const toast = useToast();
  const { data: settings } = useStoreSettings();
  const navigate = useNavigate();
  const symbol = settings?.general?.currencySymbol;
  const formatCurrency = useCurrencyFormatter(symbol);

  // Totals from server
  const subtotal = cart?.subtotal || 0;
  const total = cart?.totalAmount || 0;
  const shippingCost = cart?.shipping || 0;
  const isFreeShipping = shippingCost === 0;
  const effectiveTotal = previewTotal != null ? Number(previewTotal) + Number(shippingCost) : total;
  const hasCartItems = (cart?.items?.length || 0) > 0;
  const couponApplied = previewDiscount > 0;

  const handleCouponPreview = (info: { code: string; applied: boolean; discount: number; previewTotal: number | null; message: string; }) => {
    setPreviewDiscount(info.discount || 0);
    setPreviewTotal(info.previewTotal ?? null);
  };

  const onSubmit = async (values: ShippingFormValues) => {
    try {
      await placeOrderMutation.mutateAsync({
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
      });
      navigate(`/home`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <PageContainer
      isLoading={isPending || isAddressesPending}
      isMaskLoading={placeOrderMutation.isPending}
    >
      <div className={styles.checkoutPage}>
        <Card fullWidth header="Shipping Information">
          <ShippingForm
            isAuthenticated={isAuthenticated}
            addresses={addresses}
            onSubmit={onSubmit}
            placing={placeOrderMutation.isPending}
            disableSubmit={!hasCartItems || isPending || isAddressesPending}
            onCouponPreview={handleCouponPreview}
          />
        </Card>

        <Card className={styles.checkoutPageSummary} fullWidth header="Your Shopping Cart">
          <div className={styles.checkoutPageSummaryList}>
            {(cart?.items || []).map((item) => (
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

          <div className={clsx(styles.checkoutPageSummaryRow, 'bts-marginTl')}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {couponApplied && previewDiscount > 0 && (
            <div className={styles.checkoutPageSummaryRow}>
              <span>Discount</span>
              <span>-{formatCurrency(previewDiscount)}</span>
            </div>
          )}
          <div className={styles.checkoutPageSummaryRow}>
            <span>Shipping</span>
            <span>{isFreeShipping ? 'Free' : formatCurrency(shippingCost)}</span>
          </div>
          <Divider className="bts-marginBl" />
          <div className={`${styles.checkoutPageSummaryRow} ${styles.checkoutPageSummaryRowTotal}`}>
            <span>Total</span>
            <span>{formatCurrency(effectiveTotal)}</span>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CheckoutPage;
