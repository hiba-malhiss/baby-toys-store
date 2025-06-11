import styles from './footer.module.scss';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Button } from '../../commmon/Button/Button.tsx';
import Flex from '../Flex/Flex.tsx';

const exploreLinks = [
  'My account',
  'Track my order',
  'Terms of use',
  'Wishlist',
  'Submit Your feedback',
];

const socialMediaLinks = [
  { icon: faFacebookF, url: '' },
  { icon: faTwitter, url: '' },
  { icon: faInstagram, url: '' },
];

const customerServiceInfo = [
  'Monday to Friday',
  '10am - 6pm (New York time)',
  { label: 'Call us:', value: '123-456-7868', link: 'tel:1234567868' },
  { label: 'Email us:', value: 'info@example.com', link: 'mailto:info@example.com' },
];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Flex direction="vertical">
        <img src="/assets/images/logo.png" alt="logo" />
        <p className={styles.footerDescription}>
          Bringing you quality products at affordable prices.
        </p>
        <Flex spacing="xl">
          {socialMediaLinks.map(({ icon, url }) => (
            <Button key={icon.iconName} leftIcon={icon} onClick={() => console.log(url)} />
          ))}
        </Flex>
      </Flex>

      <Flex direction="vertical">
        <h4 className={styles.footerSectionHeader}>Explore</h4>
        <Flex direction="vertical" spacing="xl">
          {exploreLinks.map((label) => (
            <Button key={label} withoutPadding size="small" appearance="link" onClick={() => {}}>
              {label}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Flex direction="vertical">
        <h4 className={styles.footerSectionHeader}>Customer Service</h4>
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
