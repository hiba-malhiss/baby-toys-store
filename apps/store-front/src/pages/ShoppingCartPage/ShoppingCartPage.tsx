import styles from './shopping-cart-page.module.scss';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { Button, Card, Flex, NoDataFound, Text } from '@baby-toys/ui-kit';
import { PriceDisplay } from '@baby-toys/ui-kit';
import { faBoxOpen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import CartQuantityInput from '../../components/shared/CartQuantityInput';
import { useStoreSettings } from '../../api/settingsApi';
import { useCartQuery, useRemoveFromCart } from '../../api/cartApi';

const ShoppingCartPage = () => {
  const { data: cart, isPending } = useCartQuery();
  const removeMutation = useRemoveFromCart();
  const navigate = useNavigate();
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;
  const formatCurrency = useCurrencyFormatter(symbol);
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  if (!isPending && items.length === 0) {
    return (
      <PageContainer
        isBreadcrumbHidden
        isLoading={false}
        className={clsx(
          styles.shoppingCartPage,
          items.length === 0 && styles.shoppingCartPageIsEmpty
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
      isLoading={isPending}
      isMaskLoading={removeMutation.isPending}
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
          {items.map((item) => (
            <div key={item.id} className={styles.shoppingCartPageTableRow}>
              <div className={styles.shoppingCartPageImage}>
                <img src={item.productImage || ''} alt={item.productName} />
              </div>
              <Button
                appearance="link"
                className={styles.shoppingCartPageProductName}
                onClick={() => navigate('/product-details/' + item.productId)}
              >
                <span className={styles.shoppingCartPageName}>{item.productName}</span>
              </Button>
              <PriceDisplay
                price={item.unitPrice}
                oldPrice={item.originalPrice}
                formatCurrency={formatCurrency}
              />
              <div className={styles.shoppingCartPageQuantityInput}>
                <CartQuantityInput
                  fullWidth
                  itemId={Number(item.id)}
                  availableInStock={item.availableStock}
                  quantity={item.quantity}
                />
              </div>
              <div>{formatCurrency(item.totalPrice)}</div>
              <div>
                <Button
                  leftIcon={faTrashAlt}
                  appearance="link"
                  color="secondary"
                  onClick={() => removeMutation.mutate({ itemId: Number(item.id) })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card header="Cart Sub Total" className={styles.shoppingCartPageSummary}>
        <Flex justify="between">
          <Text weight="bold" size="lg">
            Subtotal
          </Text>
          <Text weight="bold" size="lg">
            {formatCurrency(subtotal)}
          </Text>
        </Flex>
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
