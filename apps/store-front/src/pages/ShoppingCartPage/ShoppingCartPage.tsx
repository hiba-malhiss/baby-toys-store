import styles from './shopping-cart-page.module.scss';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { useCartStore } from '../../store/useCartStore.ts';
import { Button } from '@baby-toys/ui-kit';
import { faBoxOpen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Card } from '@baby-toys/ui-kit';
import { NoDataFound } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import { TotalAmountSection } from '../../components/features/TotalAmount/TotalAmountSection.tsx';
import clsx from 'clsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import { ProductQuantityInput } from '@baby-toys/ui-kit';
import { useCartStockSync } from '../../hooks/useCartStockSync.ts';
import { useStoreSettings } from '../../api/settingsApi';

const ShoppingCartPage = () => {
  useCartStockSync();
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;
  const formatCurrency = useCurrencyFormatter(symbol);
  const neutralShipping = { cost: 0, freeThreshold: 0 };

  if (cartItems.length === 0) {
    return (
      <PageContainer
        isBreadcrumbHidden
        isLoading={false}
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
    <PageContainer header="Your Shopping Cart" className={styles.shoppingCartPage} isBreadcrumbHidden>
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
                <img src={item.product?.mainImage} alt={item.product?.name} />
              </div>
              <Button
                appearance="link"
                className={styles.shoppingCartPageProductName}
                onClick={() => navigate('/product-details/' + item.productId)}
              >
                {item.product?.name}
              </Button>
              <div>{formatCurrency(item.product?.price)}</div>
              <div className={styles.shoppingCartPageQuantityInput}>
                <ProductQuantityInput
                  fullWidth
                  availableInStock={item.product?.availableInStock}
                  quantity={item.quantity}
                  onChange={(quantity) => updateQuantity(item.productId, quantity as number)}
                ></ProductQuantityInput>
              </div>
              <div>{formatCurrency(item.product?.price * item.quantity)}</div>
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
        <TotalAmountSection items={cartItems} shipping={neutralShipping} currency={symbol || ''} className="bts-marginTxxl" />
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
