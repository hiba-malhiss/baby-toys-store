import { useNavigate } from 'react-router-dom';
import styles from './shop-now-section.module.scss';
import { Flex, Button } from '@baby-toys/ui-kit/components';

const ShopNowSection = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/shop');
  };

  return (
    <Flex
      className={styles.shopNowSectionImageContainer}
      direction="vertical"
      justify="center"
      align="end"
    >
      <Flex direction="vertical" className={styles.shopNowSectionContent}>
        <span className={styles.shopNowSectionTitle}>Play, learn, & grow!</span>
        <span className={styles.shopNowSectionSubTitle}>
          Crafting smiles with every toy, made for learning, fun, and growth
        </span>
        <Button size="xxlarge" appearance="filled" color="accent" onClick={handleShopNow}>
          Shop now
        </Button>
      </Flex>
    </Flex>
  );
};

export default ShopNowSection;
