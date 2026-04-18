import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './footer.module.scss';
import { Button, Flex, Heading, Tooltip, SocialIconButton } from '@baby-toys/ui-kit';
import { useDeviceInfo } from '@baby-toys/ui-kit/hooks';
import {
  footerInfoConfig,
  exploreLinks,
  socialMediaLinks,
  linkPrefixes,
} from './footer.constants.ts';
import { useStoreSettings } from '../../../api/settingsApi';
import { handleFooterSocialClick } from '../../../utils/share.ts';
import { useTranslation } from 'react-i18next';
import { useLogo } from "../../../hooks/useLogo.ts";

const Footer = () => {
  const navigate = useNavigate();
  const { data: settings } = useStoreSettings();
  const { isMobileLike } = useDeviceInfo();
  const logoUrl = useLogo();
  const { t } = useTranslation('common');
  const tooltipKeyByPlatform: Record<string, string> = {
    whatsapp: 'product.tooltips.shareWhatsapp',
    facebook: 'product.tooltips.shareFacebook',
  };
  const footerInfo = useMemo(
    () => Object.entries(settings?.contact || {}).map(([id, content]) => ({ id, content })),
    [settings?.contact]
  );

  return (
    <footer className={styles.footer}>
      <Flex direction="vertical" className={styles.footerLogo}>
        <img src={logoUrl} alt="logo" />
        <p className={styles.footerDescription}>{t('footer.description')}</p>
        <Flex spacing="m" className={styles.footerSocialButtons}>
          {socialMediaLinks.map(({ icon, platform }) => (
            <Tooltip
              key={platform}
              content={t(tooltipKeyByPlatform[platform] ?? 'product.tooltips.share', {
                defaultValue: tooltipKeyByPlatform[platform],
              })}
            >
              <SocialIconButton
                icon={icon}
                variant={platform}
                onClick={() => handleFooterSocialClick(platform, isMobileLike)}
              />
            </Tooltip>
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
              color="underline"
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
                <Flex direction="vertical" key={item.id} className={styles.footerInfoItem}>
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
                </Flex>
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
