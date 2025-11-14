import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { faBoxOpen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Divider, Flex, NoDataFound, Text, PriceDisplay, ConfirmDialog, Alert } from '@baby-toys/ui-kit';

import styles from './shopping-cart-page.module.scss';
import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import YouMayAlsoLikeSection from '../../components/features/YouMayAlsoLike/YouMayAlsoLikeSection.tsx';
import CartQuantityInput from '../../components/shared/CartQuantityInput';
import { useStoreSettings } from '../../api/settingsApi';
import { useCartQuery, useRemoveFromCart } from '../../api/cartApi';

const ShoppingCartPage = () => {
  const { t } = useTranslation('common');
  const { data: cart, isLoading } = useCartQuery();
  const removeMutation = useRemoveFromCart();
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol;
  const formatCurrency = useCurrencyFormatter(symbol);
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const hasOOS = items.some((i) => (i.availableStock ?? 0) <= 0);

  const handleConfirmDelete = () => {
    if(itemToDelete) {
      removeMutation.mutate({ itemId: itemToDelete.id });
      setItemToDelete(null);
    }
  };

  if(!isLoading && items.length === 0) {
    return (
      <PageContainer
        isBreadcrumbHidden
        className={clsx(
          styles.shoppingCartPage,
          styles.shoppingCartPageIsEmpty
        )}
      >
        <NoDataFound
          icon={faBoxOpen}
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
                <img src={item.productImage || ''} alt={item.productName}/>
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
                  isDisabled={(item.availableStock ?? 0) <= 0}
                />
                {(item.availableStock ?? 0) <= 0 && (
                  <Text size="sm" color="error" className="bts-marginTs">
                    {t('cart.removeOOSNotice')}
                  </Text>
                )}
              </div>
              <div>{formatCurrency(item.totalPrice)}</div>
              <div>
                <Button
                  leftIcon={faTrashAlt}
                  appearance="link"
                  color="secondary"
                  onClick={() => setItemToDelete({ id: Number(item.id), name: item.productName })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card header={t('cart.subtotal')} className={styles.shoppingCartPageSummary}>
        <Flex justify="between">
          <Text weight="bold" size="lg">{t('cart.subtotal')}</Text>
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
          isDisabled={hasOOS}
          title={hasOOS ? t('cart.removeToProceed', { defaultValue: 'Remove out-of-stock items to proceed' }) : undefined}
        >
          {hasOOS
            ? t('cart.removeToProceed', { defaultValue: 'Remove out-of-stock items to proceed' })
            : t('cart.proceed')}
        </Button>
      </Card>
      <Divider className="bts-marginTxxxxl"/>
      <YouMayAlsoLikeSection mode="flex"/>

      <ConfirmDialog
        visible={!!itemToDelete}
        header={t('cart.deleteItemTitle')}
        message={
          <Trans
            ns="common"
            i18nKey="cart.deleteItemMessage"
            values={{ itemName: itemToDelete?.name }}
            components={{ strong: <strong className={styles['shoppingCartPage-dialogStrong']}/> }}
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
