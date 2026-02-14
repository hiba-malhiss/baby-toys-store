import { Card, Flex, Accordion, Button, Divider, TabBar, TabBarItem } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { getSupportedLocales } from '../../i18n/locale.ts';
import { useHomePageContentForm } from './useHomePageContentForm';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import HeroBannersSection from './HeroBannersSection';
import InfoCardsSection from './InfoCardsSection';
import GallerySection from './GallerySection';

const HomePageContent: React.FC = () => {
  const { t } = useTranslation();
  const {
    control,
    heroBanners,
    infoCards,
    galleryUploaderProps,
    handleSubmit,
    isLoading,
    isSubmitting,
    errors,
  } = useHomePageContentForm();

  const locales = getSupportedLocales();

  return (
    <AdminLayout isLoading={isLoading}>
      <Card header={t('homepage.title')} fullWidth>
        <Flex direction="vertical" spacing="xxl" fullWidth>
          {/* === Hero Banners Section === */}
          <Accordion
            header={t('homepage.sections.heroBanners')}
            buttonAppearance="outline"
            buttonColor={errors?.heroBanners && 'error'}
          >
            <TabBar
              fullWidth
              size="small"
              tabs={locales.map((l) => ({
                header: `${l.toUpperCase()} (${l})`,
                value: `${l}-banner`,
              }))}
            >
              {locales.map((l) => (
                <TabBarItem key={l} value={`${l}-banner`}>
                  <HeroBannersSection locale={l} control={control} heroBanners={heroBanners} />
                </TabBarItem>
              ))}
            </TabBar>
          </Accordion>

          {/* === Info Cards Section === */}
          <Accordion
            header={t('homepage.sections.infoCards')}
            buttonAppearance="outline"
            buttonColor={errors?.infoCards && 'error'}
          >
            <TabBar
              fullWidth
              size="small"
              tabs={locales.map((l) => ({
                header: `${l.toUpperCase()} (${l})`,
                value: `${l}-info`,
              }))}
            >
              {locales.map((l) => (
                <TabBarItem key={l} value={`${l}-info`}>
                  <InfoCardsSection locale={l} control={control} infoCards={infoCards} />
                </TabBarItem>
              ))}
            </TabBar>
          </Accordion>

          {/* === Gallery Section === */}
          <Accordion header={t('homepage.sections.gallery')} buttonAppearance="outline">
            <GallerySection galleryUploaderProps={galleryUploaderProps} />
          </Accordion>

          <Divider thickness="2px" />

          <Flex justify="end">
            <Button type="submit" color="primary" loading={isSubmitting} onClick={handleSubmit}>
              {t('homepage.actions.saveChanges')}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </AdminLayout>
  );
};

export default HomePageContent;
