import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Package } from 'lucide-react';
import {
  Button,
  Card,
  Divider,
  Flex,
  NoDataFound,
  Text,
  PriceDisplay,
  ConfirmDialog,
  Alert,
} from '@baby-toys/ui-kit';

import styles from './shopping-cart-page.module.scss';
import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import CartQuantityInput from '../../components/shared/CartQuantityInput';
import { useStoreSettings } from '../../api/settingsApi';
import { useCartQuery, useRemoveFromCart } from '../../api/cartApi';
import { useAddToWishlist } from '../../api/wishlistApi';
import { useAuth } from '../../context/AuthContext.tsx';

const ShoppingCartPage = () => {
  const { t } = useTranslation('common');
  const { data: cart, isLoading } = useCartQuery();
  const removeMutation = useRemoveFromCart();
  const addToWishlist = useAddToWishlist();
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;
  const formatCurrency = useCurrencyFormatter(symbol);
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const hasOOS = items.some((i) => (i.availableStock ?? 0) <= 0);
  const hasOverAllocated = items.some(
    (i) => (i.availableStock ?? 0) > 0 && i.quantity > (i.availableStock ?? 0)
  );
  const { isAuthenticated } = useAuth();

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeMutation.mutate({ itemId: itemToDelete.id });
      setItemToDelete(null);
    }
  };

  const handleMoveToWishlist = async (item: {
    id: number;
    productId: number;
    productName: string;
  }) => {
    try {
      await addToWishlist.mutateAsync({ productId: item.productId });
      removeMutation.mutate({ itemId: item.id });
    } catch (e) {
      // noop; UI kit toasts handled inside hooks if any
    }
  };

  if (!isLoading && items.length === 0) {
    return (
      <PageContainer
        isBreadcrumbHidden
        className={clsx(styles.shoppingCartPage, styles.shoppingCartPageIsEmpty)}
      >
        <NoDataFound
          iconComp={Package}
          message={t('cart.empty')}
          buttonText={t('cart.browse')}
          onButtonClick={() => navigate('/shop')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={t('cart.header')}
      className={styles.shoppingCartPage}
      isBreadcrumbHidden
      isLoading={isLoading}
      isMaskLoading={removeMutation.isPending}
    >
      <div className={styles.shoppingCartPageTable}>
        {hasOOS && (
          <Alert appearance="warning" className="bts-marginBm">
            {t('cart.removeOOSGlobal')}
          </Alert>
        )}
        {hasOverAllocated && (
          <Alert appearance="warning" className="bts-marginBm">
            {t('cart.reduceQtyGlobal')}
          </Alert>
        )}
        <div className={styles.shoppingCartPageTableHeader}>
          <div>{t('cart.headers.product')}</div>
          <div>{t('cart.headers.name')}</div>
          <div>{t('cart.headers.price')}</div>
          <div>{t('cart.headers.quantity')}</div>
          <div>{t('cart.headers.subtotal')}</div>
          <div>{t('cart.headers.action')}</div>
        </div>

        <div className={styles.shoppingCartPageTableBody}>
          {items.map((item) => (
            <div key={item.id} className={styles.shoppingCartPageTableRow}>
              <div className={styles.shoppingCartPageImage}>
                <img src={item.productImage || undefined} alt={item.productName} />
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
                className={(item.availableStock ?? 0) <= 0 ? styles.oosPrice : undefined}
              />
              <div className={styles.shoppingCartPageQuantityInput}>
                <CartQuantityInput
                  fullWidth
                  itemId={Number(item.id)}
                  availableInStock={item.availableStock}
                  quantity={item.quantity}
                  isDisabled={(item.availableStock ?? 0) <= 0}
                />
                {(item.availableStock ?? 0) <= 0 && (
                  <Text size="sm" color="error" className="bts-marginTs">
                    {t('cart.removeOOSNotice')}
                  </Text>
                )}
                {(item.availableStock ?? 0) > 0 && item.quantity > (item.availableStock ?? 0) && (
                  <Text size="sm" color="warning" className="bts-marginTs">
                    {t('cart.reduceToStock', { count: item.availableStock })}
                  </Text>
                )}
              </div>
              <div className={(item.availableStock ?? 0) <= 0 ? styles.oosPrice : undefined}>
                {formatCurrency(item.totalPrice)}
              </div>
              <div>
                <Flex spacing="xs" align="center">
                  <Button
                    appearance="link"
                    color="highlighted"
                    withoutPadding
                    onClick={() => setItemToDelete({ id: Number(item.id), name: item.productName })}
                  >
                    {t('common.delete', { defaultValue: 'Delete' })}
                  </Button>
                  {isAuthenticated && (
                    <>
                      <span>|</span>
                      <Button
                        appearance="link"
                        color="highlighted"
                        withoutPadding
                        onClick={() =>
                          handleMoveToWishlist({
                            id: Number(item.id),
                            productId: Number(item.productId),
                            productName: item.productName,
                          })
                        }
                      >
                        {t('cart.removeAndMoveToWishlist', {
                          defaultValue: 'Remove and move to wishlist',
                        })}
                      </Button>
                    </>
                  )}
                </Flex>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card header={t('cart.subtotal')} className={styles.shoppingCartPageSummary}>
        <Flex justify="between">
          <Text weight="bold" size="lg">
            {t('cart.subtotal')}
          </Text>
          <Text weight="bold" size="lg">
            {formatCurrency(subtotal || 0)}
          </Text>
        </Flex>
        <Button
          color="accent"
          fullWidth
          size="large"
          className="bts-marginTxl"
          onClick={() => navigate('/checkout')}
          isDisabled={hasOOS || hasOverAllocated}
          title={
            hasOOS
              ? t('cart.removeToProceed')
              : hasOverAllocated
                ? t('cart.reduceToProceed')
                : undefined
          }
        >
          {hasOOS
            ? t('cart.removeToProceed')
            : hasOverAllocated
              ? t('cart.reduceToProceed')
              : t('cart.proceed')}
        </Button>
      </Card>
      <Divider className="bts-marginTxxxxl" />
      <YouMayAlsoLikeSection mode="flex" />

      <ConfirmDialog
        visible={!!itemToDelete}
        header={t('cart.deleteItemTitle')}
        message={
          <Trans
            ns="common"
            i18nKey="cart.deleteItemMessage"
            values={{ itemName: itemToDelete?.name }}
            components={{ strong: <strong className={styles['shoppingCartPage-dialogStrong']} /> }}
          />
        }
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </PageContainer>
  );
};

export default ShoppingCartPage;
