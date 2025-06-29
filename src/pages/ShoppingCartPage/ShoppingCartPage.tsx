import { useState, useEffect } from 'react';
import styles from './shopping-cart-page.module.scss';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { useCartStore } from '../../store/useCartStore.ts';
import { StringInput } from '../../components/common/StringInput/StringInput.tsx';
import { Button } from '../../components/common/Button/Button.tsx';
import { faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Card from '../../components/common/Card/Card.tsx';
import { EmptyPlaceholder } from '../../components/common/EmptyPlaceholder/EmptyPlaceholder.tsx';
import { useNavigate } from 'react-router-dom';
import { TotalAmountSection } from '../../components/smart/OrderSummary/TotalAmountSection.tsx';
import { useMockProductsApi } from '../../mock-data/useMockProductsApi.ts';
import { formatCurrency } from '../../util/format.utils.ts';
import clsx from 'clsx';
import Heading from '../../components/common/Heading/Heading.tsx';

const ShoppingCartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState({ currency: 'USD', symbol: '$' });
  const [shippingSettings, setShippingSettings] = useState({ cost: 0, freeThreshold: 0 });
  const [loading, setLoading] = useState(true);
  
  const { getCurrencySettings, getShippingSettings } = useMockProductsApi(10);

  // Load currency and shipping settings
  useEffect(() => {
    Promise.all([
      getCurrencySettings(),
      getShippingSettings()
    ])
      .then(([currencyData, shippingData]) => {
        setCurrency(currencyData);
        setShippingSettings(shippingData);
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getCurrencySettings, getShippingSettings]);

  if (loading) {
    return (
      <PageContainer className={styles.shoppingCartPage} isBreadcrumbHidden>
        <div>Loading cart...</div>
      </PageContainer>
    );
  }

  if (cartItems.length === 0) {
    return (
      <PageContainer
        isBreadcrumbHidden
        className={clsx(
          styles.shoppingCartPage,
          cartItems.length === 0 && styles.shoppingCartPageIsEmpty
        )}
      >
        <EmptyPlaceholder
          iconSize="pagelarge"
          icon={faShoppingCart}
          message="Your cart is empty"
          buttonText="Start Shopping"
          onButtonClick={() => {
            navigate('/shop');
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className={styles.shoppingCartPage} isBreadcrumbHidden>
      <Heading level="h1" className="bts-marginBxl">
        Your Shopping Cart
      </Heading>
      <div className={styles.shoppingCartPageTable}>
        <div className={styles.shoppingCartPageTableHeader}>
          <div>Product</div>
          <div>Name</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Subtotal</div>
          <div>Action</div>
        </div>

        <div className={styles.shoppingCartPageTableBody}>
          {cartItems.map((item) => (
            <div key={item.productId} className={styles.shoppingCartPageTableRow}>
              <div className={styles.shoppingCartPageImage}>
                <img src={item.mainImage} alt={item.name} />
              </div>
              <div className={styles.shoppingCartPageProductName}>{item.name}</div>
              <div>{formatCurrency(item.price, currency.symbol)}</div>
              <div className={styles.shoppingCartPageQuantityInput}>
                <StringInput
                  type="number"
                  min={1}
                  value={item.quantity}
                  withControls
                  onChange={(quantity) => updateQuantity(item.productId, quantity)}
                  size="small"
                  fullWidth
                />
              </div>
              <div>{formatCurrency(item.price * item.quantity, currency.symbol)}</div>
              <div>
                <Button
                  leftIcon={faTrashAlt}
                  appearance="link"
                  color="secondary"
                  onClick={() => removeFromCart(item.productId)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card header="Cart Total" className={styles.shoppingCartPageSummary}>
        <TotalAmountSection
          items={cartItems}
          shipping={shippingSettings}
          currency={currency.symbol}
          className="bts-marginTxxl"
        />
        <Button color="accent" fullWidth size="large" className="bts-marginTxl">
          Proceed to checkout
        </Button>
      </Card>
    </PageContainer>
  );
};

export default ShoppingCartPage;