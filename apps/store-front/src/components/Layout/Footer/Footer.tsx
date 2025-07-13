import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './footer.module.scss';
import { Button, Flex, Heading } from '@baby-toys/ui-kit/components';
import { footerInfoConfig, exploreLinks, socialMediaLinks } from './footer.constants.ts';
import { mockFetchContactInfo } from '@mock-data/useMockProductsApi.ts';

const Footer = () => {
  const navigate = useNavigate();
  const [footerInfo, setFooterInfo] = useState<any[]>([]);

  useEffect(() => {
    mockFetchContactInfo().then((data) => {
      setFooterInfo(data);
    });
  }, []);

  return (
    <footer className={styles.footer}>
      <Flex direction="vertical" className={styles.footerLogo}>
        <img src="/assets/ui-kit-images/logo.png" alt="logo" />
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
        <Flex direction="vertical" spacing="s" justify="center">
          {footerInfo.map((item) => {
            const config = footerInfoConfig[item.id] || {};
            if (config.isLink && config.label) {
              return (
                <p key={item.id}>
                  {config.label}{' '}
                  <Button
                    withoutPadding
                    size="small"
                    appearance="link"
                    color={config.appearance || 'highlighted'}
                    onClick={() => window.open(config.link, '_blank')}
                  >
                    {item.content}
                  </Button>
                </p>
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
