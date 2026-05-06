import React, { useState } from 'react';
import {
  Card,
  Heading,
  Button,
  Divider,
  TabBar,
  TabBarItem,
  ImageUploader,
  Accordion,
  Flex,
} from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { useLocales } from '../../hooks/useLocales';
import { useHomePageContentForm } from './useHomePageContentForm';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import BannersSection from './BannersSection';
import MainBannerSection from './MainBannerSection';
import InfoCardsSection from './InfoCardsSection';
import GallerySection from './GallerySection';
import FooterSection from './FooterSection';
import { Image, LayoutTemplate, Info, Grid2x2, ImageDown } from 'lucide-react';
import styles from './home-page-content.module.scss';

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; hint: string }> = ({
  icon,
  title,
  hint,
}) => (
  <div className={styles.sectionHeader}>
    <div className={styles.sectionIcon}>{icon}</div>
    <div className={styles.sectionText}>
      <span className={styles.sectionTitle}>{title}</span>
      <span className={styles.sectionHint}>{hint}</span>
    </div>
  </div>
);

const HomePageContent: React.FC = () => {
  const { t } = useTranslation();
  const {
    control,
    infoCards,
    mainBanners,
    galleryUploaderProps,
    banner1UploaderProps,
    banner2UploaderProps,
    mainBannerUploaderProps,
    footerUploaderProps,
    handleSubmit,
    isLoading,
    isSubmitting,
  } = useHomePageContentForm();

  const locales = useLocales();
  const [mainBannerTab, setMainBannerTab] = useState(locales[0] ? `${locales[0]}-mainBanner` : '');
  const [infoCardsTab, setInfoCardsTab] = useState(locales[0] ? `${locales[0]}-info` : '');

  return (
    <AdminLayout isLoading={isLoading}>
      <div className={styles.pageLayout}>
        <Heading>{t('homepage.title')}</Heading>

        {/* Banners */}
        <Card size="small">
          <Accordion
            buttonColor="light"
            buttonAppearance="link"
            withoutHeaderPadding
            defaultOpen
            header={
              <SectionHeader
                icon={<Image size={20} />}
                title={t('homepage.sections.banners')}
                hint={t('homepage.sections.bannersHint', {
                  defaultValue: 'Side-by-side promotional banners with text overlay',
                })}
              />
            }
          >
            <div className={styles.accordionBody}>
              <BannersSection
                control={control}
                banner1UploaderProps={banner1UploaderProps}
                banner2UploaderProps={banner2UploaderProps}
              />
            </div>
          </Accordion>
        </Card>

        {/* Main Banner */}
        <Card size="small">
          <Accordion
            buttonColor="light"
            buttonAppearance="link"
            withoutHeaderPadding
            header={
              <SectionHeader
                icon={<LayoutTemplate size={20} />}
                title={t('homepage.sections.mainBanner')}
                hint={t('homepage.sections.mainBannerHint', {
                  defaultValue: 'Full-width hero banner with title, subtitle, and call-to-action',
                })}
              />
            }
          >
            <div className={styles.accordionBody}>
              <TabBar
                fullWidth
                size="small"
                value={mainBannerTab}
                onChange={setMainBannerTab}
                tabs={locales.map((l) => ({ header: l.toUpperCase(), value: `${l}-mainBanner` }))}
              >
                {locales.map((l) => {
                  const idx = mainBanners.findIndex((mb: any) => mb?.locale === l);
                  const baseName = idx >= 0 ? `mainBanners.${idx}` : `mainBanners.0`;
                  return (
                    <TabBarItem key={l} value={`${l}-mainBanner`}>
                      <div className={styles.tabContent}>
                        <MainBannerSection control={control} baseName={baseName} />
                      </div>
                    </TabBarItem>
                  );
                })}
              </TabBar>
              <Divider className="bts-marginVl" />
              <div>
                <p>
                  {t('homepage.mainBanner.images', { defaultValue: 'Banner images (up to 5)' })}
                </p>
                <ImageUploader {...mainBannerUploaderProps} maxImages={5} />
              </div>
            </div>
          </Accordion>
        </Card>

        {/* Info Cards */}
        <Card size="small">
          <Accordion
            buttonColor="light"
            buttonAppearance="link"
            withoutHeaderPadding
            header={
              <SectionHeader
                icon={<Info size={20} />}
                title={t('homepage.sections.infoCards')}
                hint={t('homepage.sections.infoCardsHint', {
                  defaultValue: 'Feature highlights shown on the storefront homepage',
                })}
              />
            }
          >
            <div className={styles.accordionBody}>
              <TabBar
                fullWidth
                size="small"
                value={infoCardsTab}
                onChange={setInfoCardsTab}
                tabs={locales.map((l) => ({ header: l.toUpperCase(), value: `${l}-info` }))}
              >
                {locales.map((l) => (
                  <TabBarItem key={l} value={`${l}-info`}>
                    <div className={styles.tabContent}>
                      <InfoCardsSection locale={l} control={control} infoCards={infoCards} />
                    </div>
                  </TabBarItem>
                ))}
              </TabBar>
            </div>
          </Accordion>
        </Card>

        {/* Gallery */}
        <Card size="small">
          <Accordion
            buttonColor="light"
            buttonAppearance="link"
            withoutHeaderPadding
            header={
              <SectionHeader
                icon={<Grid2x2 size={20} />}
                title={t('homepage.sections.gallery')}
                hint={t('homepage.sections.galleryHint', {
                  defaultValue: 'Photo grid displayed on the storefront homepage (up to 4 images)',
                })}
              />
            }
          >
            <div className={styles.accordionBody}>
              <GallerySection galleryUploaderProps={galleryUploaderProps} />
            </div>
          </Accordion>
        </Card>

        {/* Footer Image */}
        <Card size="small">
          <Accordion
            buttonColor="light"
            buttonAppearance="link"
            withoutHeaderPadding
            header={
              <SectionHeader
                icon={<ImageDown size={20} />}
                title={t('homepage.sections.footer', { defaultValue: 'Footer Image' })}
                hint={t('homepage.sections.footerHint', {
                  defaultValue: 'Payment strip, partner logos, or decorative footer banner',
                })}
              />
            }
          >
            <div className={styles.accordionBody}>
              <FooterSection footerUploaderProps={footerUploaderProps} />
            </div>
          </Accordion>
        </Card>

        <Flex justify="end" fullWidth>
          <Button color="primary" isLoading={isSubmitting} onClick={handleSubmit}>
            {t('homepage.actions.saveChanges')}
          </Button>
        </Flex>
      </div>
    </AdminLayout>
  );
};

export default HomePageContent;
