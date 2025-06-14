import Flex from '../../../components/layout/Flex/Flex.tsx';
import styles from './banners-section.module.scss';

const BannersSection = () => {
  return (
    <Flex spacing="xxl" fullWidth className={styles.banner} wrap justify="center">
      <Flex
        align="center"
        justify="center"
        className={styles.bannerWrapper + ' ' + styles.bannerWrapperCenter}
      >
        <p>Discover the Joy of Play</p>
      </Flex>
      <Flex
        align="center"
        justify="end"
        className={styles.bannerWrapper + ' ' + styles.bannerWrapperTopRight}
      >
        <p>Flash sale 30%, Extra discount for loyal customers</p>
      </Flex>
    </Flex>
  );
};

export default BannersSection;
