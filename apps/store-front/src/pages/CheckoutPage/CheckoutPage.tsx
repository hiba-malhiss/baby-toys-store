import React, { useState, useEffect } from 'react';
import styles from './checkout-page.module.scss';
import { useCartStore } from '../../store/useCartStore';
import {
  Button,
  Card,
  StringInput,
  FieldWrapper,
  Select,
  useToast,
} from '@baby-toys/ui-kit';
import { calculateOrderSummary } from '../../utils/order.utils';
import { useStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';
import { mockPlaceOrder, mockFetchShippingInfo } from '@mock-data/useMockApi';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@baby-toys/ui-kit';
import clsx from 'clsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useAuth } from '../../context/AuthContext.tsx';
import { Alert } from '@baby-toys/ui-kit';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { OrderPayload } from '../../types/product.types.ts';
import { useCartStockSync } from '../../hooks/useCartStockSync.ts';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';

const COUNTRIES = [{ label: 'Palestine', value: 'palestine' }];

const CheckoutPage: React.FC = () => {
  useCartStockSync();
  const { cartItems, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    country: '',
    firstName: '',
    lastName: '',
    region: '',
    address: '',
    town: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loadingShippingInfo, setLoadingShippingInfo] = useState(false);
  const [isLoadedFromCloud, setIsLoadedFromCloud] = useState(false);
  const toast = useToast();
  const { currency, shipping } = useStoreConfiguration();
  const navigate = useNavigate();
  const formatCurrency = useCurrencyFormatter(currency?.symbol);

  // Load saved shipping information when user is logged in
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setLoadingShippingInfo(true);
      mockFetchShippingInfo(user.email)
        .then((shippingInfo) => {
          if (shippingInfo) {
            setForm(shippingInfo);
            setIsLoadedFromCloud(true);
          }
        })
        .catch((error) => {
          console.error('Error loading shipping info:', error);
        })
        .finally(() => {
          setLoadingShippingInfo(false);
        });
    }
  }, []);

  // Calculate order summary (returns numbers)
  const {
    subtotal,
    total,
    shipping: shippingCost,
    isFreeShipping,
  } = calculateOrderSummary(cartItems, shipping);

  const handleInput = (name: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [name]: String(value) }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.region) newErrors.region = 'Village/Region is required';
    if (!form.address) newErrors.address = 'Detailed address is required';
    if (!form.town) newErrors.town = 'Town is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacingOrder(true);
    try {
      const orderData: OrderPayload = {
        shippingInfo: form,
        cartItems: cartItems,
        total,
        shippingCost,
      };
      await mockPlaceOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/home`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <PageContainer isLoading={loadingShippingInfo}>
      <div className={styles.checkoutPage}>
        <Card className={styles.checkoutPageForm} fullWidth header="Shipping Information">
          {isAuthenticated && isLoadedFromCloud && (
            <Alert icon={faCheck} title="Using your saved shipping information">
              <Button
                appearance="link"
                color="primary"
                withoutPadding
                size="small"
                onClick={() => {
                  setForm({
                    country: '',
                    firstName: '',
                    lastName: '',
                    region: '',
                    address: '',
                    town: '',
                    phone: '',
                  });
                }}
              >
                Use different shipping address
              </Button>
            </Alert>
          )}

          <FieldWrapper label="Country" error={errors.country}>
            <Select
              options={COUNTRIES}
              hasError={!!errors.country}
              value={form.country}
              onChange={(val) => handleInput('country', val)}
              placeholder="Select country"
            />
          </FieldWrapper>

          <div className={styles.checkoutPageFormRow}>
            <FieldWrapper label="First Name" error={errors.firstName}>
              <StringInput
                hasError={!!errors.firstName}
                value={form.firstName}
                fullWidth
                onChange={(val) => handleInput('firstName', val)}
              />
            </FieldWrapper>
            <FieldWrapper label="Last Name" error={errors.lastName}>
              <StringInput
                hasError={!!errors.lastName}
                value={form.lastName}
                fullWidth
                onChange={(val) => handleInput('lastName', val)}
              />
            </FieldWrapper>
          </div>

          <div className={styles.checkoutPageFormRow}>
            <FieldWrapper label="Town" error={errors.town}>
              <StringInput
                hasError={!!errors.town}
                value={form.town}
                fullWidth
                onChange={(val) => handleInput('town', val)}
              />
            </FieldWrapper>
            <FieldWrapper label="Village or Region" error={errors.region}>
              <StringInput
                hasError={!!errors.region}
                value={form.region}
                fullWidth
                onChange={(val) => handleInput('region', val)}
              />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Detailed Address" error={errors.address}>
            <StringInput
              fullWidth
              hasError={!!errors.address}
              value={form.address}
              onChange={(val) => handleInput('address', val)}
            />
          </FieldWrapper>

          <FieldWrapper label="Phone Number" error={errors.phone}>
            <StringInput
              fullWidth
              hasError={!!errors.phone}
              value={form.phone}
              onChange={(val) => handleInput('phone', val)}
            />
          </FieldWrapper>

          <Button onClick={handleOrder} fullWidth isLoading={placingOrder}>
            Place Order
          </Button>
        </Card>

        <Card className={styles.checkoutPageSummary} fullWidth header="Your Shopping Cart">
          <div className={styles.checkoutPageSummaryList}>
            {cartItems.map((item) => (
              <div className={styles.checkoutPageSummaryItem} key={item.productId}>
                <img src={item.product.mainImage} alt={item.product.name} />
                <div>
                  <div className={styles.checkoutPageSummaryItemName}>{item.product.name}</div>
                  <div className="bts-paddingTs">x{item.quantity}</div>
                </div>
                <div>{formatCurrency(item.product.price)}</div>
                <Divider fullWidth />
              </div>
            ))}
          </div>

          <div className={clsx(styles.checkoutPageSummaryRow, 'bts-marginTl')}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.checkoutPageSummaryRow}>
            <span>Shipping</span>
            <span>{isFreeShipping ? 'Free' : formatCurrency(shippingCost)}</span>
          </div>
          <Divider className="bts-marginBl" />
          <div className={`${styles.checkoutPageSummaryRow} ${styles.checkoutPageSummaryRowTotal}`}>
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CheckoutPage;
