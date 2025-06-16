import styles from './footer.module.scss';
import { Button } from '../../common/Button/Button.tsx';
import { customerServiceInfo, exploreLinks, socialMediaLinks } from './footer.constants.ts';
import Flex from '../../common/Flex/Flex.tsx';
import Heading from '../../common/Heading/Heading.tsx';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Flex direction="vertical" className={styles.footerLogo}>
        <img src="/assets/images/logo.png" alt="logo" />
        <p className={styles.footerDescription}>
          Bringing you quality products at affordable prices.
        </p>
        <Flex spacing="xl">
          {socialMediaLinks.map(({ icon, url }) => (
            <Button
              key={icon.iconName}
              appearance="secondary"
              leftIcon={icon}
              onClick={() => console.log(url)}
            />
          ))}
        </Flex>
      </Flex>

      <Flex direction="vertical">
        <Heading level="h3" className={styles.footerSectionHeader}>
          Explore
        </Heading>
        <Flex direction="vertical" spacing="xl">
          {exploreLinks.map((label) => (
            <Button key={label} withoutPadding size="small" appearance="link" onClick={() => {}}>
              {label}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Flex direction="vertical">
        <Heading level="h3" className={styles.footerSectionHeader}>
          Customer Service
        </Heading>
        <Flex direction="vertical" spacing="xl">
          {customerServiceInfo.map((item, index) =>
            typeof item === 'string' ? (
              <p key={index}>{item}</p>
            ) : (
              <p key={index}>
                {item.label}{' '}
                <Button
                  key={item.label}
                  withoutPadding
                  size="small"
                  appearance="primary-link"
                  onClick={() => {}}
                >
                  {item.value}
                </Button>
              </p>
            )
          )}
        </Flex>
      </Flex>
    </footer>
  );
};

export default Footer;
