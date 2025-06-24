import styles from './shopping-cart-page.module.scss';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { useState } from 'react';
import ShoppingCartDrawer from '../../components/smart/ShoppingCartDrawer/ShoppingCartDrawer.tsx';
import { Button } from '../../components/common/Button/Button.tsx';

const ShoppingCartPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PageContainer className={styles.shoppingCartPage}>
      <Button onClick={() => setIsOpen(!isOpen)}>click</Button>
      <ShoppingCartDrawer isOpen={isOpen} setIsOpen={setIsOpen}></ShoppingCartDrawer>
    </PageContainer>
  );
};

export default ShoppingCartPage;
