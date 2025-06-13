import styles from './shop-now-section.module.scss';
import Flex from '../../../components/layout/Flex/Flex.tsx';
import { Button } from '../../../components/commmon/Button/Button.tsx';

const ShopNowSection = () => {
  return (
    <Flex className={styles.shopNowSectionImageContainer} direction="vertical" align="end">
      <Flex direction="vertical">
        <span className={styles.shopNowSectionTitle}>Play, learn, & grow!</span>
        <span className={styles.shopNowSectionSubTitle}>
          Crafting smiles with every toy, made for learning, fun, and growth
        </span>
        <Button size="xlarge" appearance="secondary">
          Shop now
        </Button>
      </Flex>
    </Flex>
  );
};

export default ShopNowSection;
