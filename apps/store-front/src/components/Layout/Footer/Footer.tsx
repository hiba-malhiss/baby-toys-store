import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './footer.module.scss';
import { Button, Flex, Heading } from '@baby-toys/ui-kit';
import {
  footerInfoConfig,
  exploreLinks,
  socialMediaLinks,
  linkPrefixes,
} from './footer.constants.ts';
import { useStoreSettings } from '../../../api/settingsApi';

const Footer = () => {
  const navigate = useNavigate();
  const { data: settings } = useStoreSettings();
  const footerInfo = useMemo(
    () => Object.entries(settings?.contact || {}).map(([id, content]) => ({ id, content })),
    [settings?.contact]
  );

  return (
    <footer className={styles.footer}>
      <Flex direction="vertical" className={styles.footerLogo}>
        <img src="/assets/kit-images/logo.png" alt="logo" />
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

      <Flex direction="vertical" className={styles.footerCustomerService}>
        <Heading level="h3" className={styles.footerSectionHeader}>
          Customer Service
        </Heading>
        <Flex direction="vertical" spacing="s" justify="center">
          {footerInfo.map((item) => {
            const config = footerInfoConfig[item.id] || {};
            if (config.isLink && config.label) {
              const dynamicLink = linkPrefixes[item.id]
                ? `${linkPrefixes[item.id]}${item.content}`
                : config.link;
              return (
                <div key={item.id} className={styles.footerInfoItem}>
                  {config.label}{' '}
                  <Button
                    withoutPadding
                    size="small"
                    appearance="link"
                    color={config.appearance || 'highlighted'}
                    onClick={() => window.open(dynamicLink || '', '_blank')}
                  >
                    {item.content}
                  </Button>
                </div>
              );
            }

            return <p key={item.id}>{item.content}</p>;
          })}
        </Flex>
      </Flex>
    </footer>
  );
};

export default Footer;
