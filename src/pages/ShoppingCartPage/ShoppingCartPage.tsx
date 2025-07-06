import { useStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';
import styles from './shopping-cart-page.module.scss';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { useCartStore } from '../../store/useCartStore.ts';
import { StringInput } from '../../components/common/StringInput/StringInput.tsx';
import { Button } from '../../components/common/Button/Button.tsx';
import { faBoxOpen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Card from '../../components/common/Card/Card.tsx';
import { NoDataFound } from '../../components/common/NoDataFound';
import { useNavigate } from 'react-router-dom';
import { TotalAmountSection } from '../../components/smart/TotalAmount/TotalAmountSection.tsx';
import clsx from 'clsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import YouMayAlsoLikeSection from '../../components/smart/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';

const ShoppingCartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  const { currency, shipping, isLoadingConfigs } = useStoreConfiguration();

  const formatCurrency = useCurrencyFormatter(currency?.symbol);

  if (cartItems.length === 0) {
    return (
      <PageContainer
        isBreadcrumbHidden
        isLoading={isLoadingConfigs || !currency || !shipping}
        className={clsx(
          styles.shoppingCartPage,
          cartItems.length === 0 && styles.shoppingCartPageIsEmpty
        )}
      >
        <NoDataFound
          icon={faBoxOpen}
          message="Oops! No toys here..."
          buttonText="Browse Toys"
          onButtonClick={() => {
            navigate('/shop');
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header="Your Shopping Cart"
      className={styles.shoppingCartPage}
      isBreadcrumbHidden
    >
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
                <img src={item.product.mainImage} alt={item.product.name} />
              </div>
              <Button
                appearance="link"
                className={styles.shoppingCartPageProductName}
                onClick={() => navigate('/product-details/' + item.productId)}
              >
                {item.product.name}
              </Button>
              <div>{formatCurrency(item.product.price)}</div>
              <div className={styles.shoppingCartPageQuantityInput}>
                <StringInput
                  type="number"
                  min={1}
                  max={item.product.quantityInStock}
                  value={item.quantity}
                  withControls
                  onChange={(quantity) => updateQuantity(item.productId, quantity as number)}
                  size="small"
                  fullWidth
                />
              </div>
              <div>{formatCurrency(item.product.price * item.quantity)}</div>
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
          shipping={shipping}
          currency={currency?.symbol}
          className="bts-marginTxxl"
        />
        <Button
          color="accent"
          fullWidth
          size="large"
          className="bts-marginTxl"
          onClick={() => navigate('/checkout')}
        >
          Proceed to checkout
        </Button>
      </Card>
      <YouMayAlsoLikeSection mode="flex" />
    </PageContainer>
  );
};

export default ShoppingCartPage;
