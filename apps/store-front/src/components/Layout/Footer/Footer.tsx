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
import { handleFooterSocialClick } from '../../../utils/share.ts';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const navigate = useNavigate();
  const { data: settings } = useStoreSettings();
  const { t } = useTranslation('common');
  const footerInfo = useMemo(
    () => Object.entries(settings?.contact || {}).map(([id, content]) => ({ id, content })),
    [settings?.contact]
  );

  return (
    <footer className={styles.footer}>
      <Flex direction="vertical" className={styles.footerLogo}>
        <img src="/assets/kit-images/logo.png" alt="logo" />
        <p className={styles.footerDescription}>{t('footer.description')}</p>
        <Flex spacing="xl">
          {socialMediaLinks.map(({ icon }) => (
            <Button
              key={icon.iconName}
              appearance="filled"
              color="accent"
              leftIcon={icon}
              onClick={() => handleFooterSocialClick(icon.iconName)}
            />
          ))}
        </Flex>
      </Flex>

      <Flex direction="vertical">
        <Heading level="h3" className={styles.footerSectionHeader}>
          {t('footer.explore')}
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
              {t(`footer.links.${label}`, { defaultValue: label })}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Flex direction="vertical" className={styles.footerCustomerService}>
        <Heading level="h3" className={styles.footerSectionHeader}>
          {t('footer.customerService')}
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
                  {t(`footer.info.${item.id}`, { defaultValue: config.label })}{' '}
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
