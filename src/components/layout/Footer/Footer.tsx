import { useNavigate } from 'react-router-dom';
import styles from './footer.module.scss';
import { Button } from '../../common/Button/Button.tsx';
import { customerServiceInfo, exploreLinks, socialMediaLinks } from './footer.constants.ts';
import Flex from '../../common/Flex/Flex.tsx';
import Heading from '../../common/Heading/Heading.tsx';

const Footer = () => {
  const navigate = useNavigate();

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
              appearance="filled"
              color="accent"
              leftIcon={icon}
              onClick={() => window.open(url, '_blank')}
            />
          ))}
        </Flex>
      </Flex>

      <Flex direction="vertical">
        <Heading level="h3" className={styles.footerSectionHeader}>
          Explore
        </Heading>
        <Flex direction="vertical" spacing="s">
          {exploreLinks.map(({ label, path }) => (
            <Button
              key={label}
              withoutPadding
              size="small"
              appearance="link"
              color="primary"
              onClick={() => navigate(path)}
            >
              {label}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Flex direction="vertical">
        <Heading level="h3" className={styles.footerSectionHeader}>
          Customer Service
        </Heading>
        <Flex direction="vertical" spacing="s">
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
                  appearance="link"
                  color="highlighted"
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
