import React, { useState, useEffect } from 'react';
import styles from './checkout-page.module.scss';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../../components/common/Button/Button';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import Card from '../../components/common/Card/Card';
import { StringInput } from '../../components/common/StringInput/StringInput';
import FieldWrapper from '../../components/common/FieldWrapper/FieldWrapper';
import { Select } from '../../components/common/Select/Select';
import { calculateOrderSummary } from '../../util/order.utils';
import { useToast } from '../../components/common/Toast/ToastContext.tsx';
import { useStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';
import { mockPlaceOrder, mockFetchShippingInfo } from '../../mock-data/useMockProductsApi.ts';
import { useNavigate } from 'react-router-dom';
import { Divider } from '../../components/common/Divider/Divider.tsx';
import clsx from 'clsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useAuth } from '../../context/AuthContext.tsx';
import { Alert } from '../../components/common/Alert/Alert.tsx';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const COUNTRIES = [{ label: 'Palestine', value: 'palestine' }];

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCartStore();
  const { user, isLoggedIn } = useAuth();
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
  const toast = useToast();
  const { currency, shipping } = useStoreConfiguration();
  const navigate = useNavigate();
  const formatCurrency = useCurrencyFormatter(currency?.symbol);

  // Load saved shipping information when user is logged in
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setLoadingShippingInfo(true);
      mockFetchShippingInfo(user.email)
        .then((shippingInfo) => {
          if (shippingInfo) {
            setForm(shippingInfo);
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
      const orderData = {
        shippingInfo: form,
        items: cartItems,
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
    <PageContainer>
      <div className={styles.checkoutPage}>
        <Card className={styles.checkoutPageForm} fullWidth header="Shipping Information">
          {isLoggedIn && !loadingShippingInfo && (form.firstName || form.lastName) && (
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
                onChange={(val) => handleInput('firstName', val)}
              />
            </FieldWrapper>
            <FieldWrapper label="Last Name" error={errors.lastName}>
              <StringInput
                hasError={!!errors.lastName}
                value={form.lastName}
                onChange={(val) => handleInput('lastName', val)}
              />
            </FieldWrapper>
          </div>

          <div className={styles.checkoutPageFormRow}>
            <FieldWrapper label="Village or Region" error={errors.region}>
              <StringInput
                hasError={!!errors.region}
                value={form.region}
                onChange={(val) => handleInput('region', val)}
              />
            </FieldWrapper>
            <FieldWrapper label="Detailed Address" error={errors.address}>
              <StringInput
                hasError={!!errors.address}
                value={form.address}
                onChange={(val) => handleInput('address', val)}
              />
            </FieldWrapper>
          </div>

          <div className={styles.checkoutPageFormRow}>
            <FieldWrapper label="Town" error={errors.town}>
              <StringInput
                hasError={!!errors.town}
                value={form.town}
                onChange={(val) => handleInput('town', val)}
              />
            </FieldWrapper>
            <FieldWrapper label="Phone Number" error={errors.phone}>
              <StringInput
                hasError={!!errors.phone}
                value={form.phone}
                onChange={(val) => handleInput('phone', val)}
              />
            </FieldWrapper>
          </div>

          <Button onClick={handleOrder} fullWidth isLoading={placingOrder}>
            Place Order
          </Button>
        </Card>

        <Card className={styles.checkoutPageSummary} fullWidth header="Your Shopping Cart">
          <div className={styles.checkoutPageSummaryList}>
            {cartItems.map((item) => (
              <div className={styles.checkoutPageSummaryItem} key={item.productId}>
                <img src={item.mainImage} alt={item.name} />
                <div>
                  <div className={styles.checkoutPageSummaryItemName}>{item.name}</div>
                  <div className="bts-paddingTs">x{item.quantity}</div>
                </div>
                <div>{formatCurrency(item.price)}</div>
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
