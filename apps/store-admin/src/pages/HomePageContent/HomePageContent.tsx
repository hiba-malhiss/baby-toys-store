import { Card, Flex, Accordion, Button, Divider, TabBar, TabBarItem } from '@baby-toys/ui-kit';
import { getSupportedLocales } from '../../components/i18n/locale';
import { useHomePageContentForm } from './useHomePageContentForm';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import HeroBannersSection from './HeroBannersSection';
import InfoCardsSection from './InfoCardsSection';
import GallerySection from './GallerySection';

const HomePageContent: React.FC = () => {
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
      <Card header="Homepage Content" fullWidth>
        <Flex direction="vertical" spacing="xxl" fullWidth>
          {/* === Hero Banners Section === */}
          <Accordion
            header="Hero Banners"
            buttonAppearance="outline"
            buttonColor={errors?.heroBanners && 'error'}
          >
            <TabBar
              fullWidth
              size="small"
              tabs={locales.map((l) => ({ header: `${l.toUpperCase()} (${l})`, value: `${l}-banner` }))}
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
            header="Info Cards"
            buttonAppearance="outline"
            buttonColor={errors?.infoCards && 'error'}
          >
            <TabBar
              fullWidth
              size="small"
              tabs={locales.map((l) => ({ header: `${l.toUpperCase()} (${l})`, value: `${l}-info` }))}
            >
              {locales.map((l) => (
                <TabBarItem key={l} value={`${l}-info`}>
                  <InfoCardsSection locale={l} control={control} infoCards={infoCards} />
                </TabBarItem>
              ))}
            </TabBar>
          </Accordion>

          {/* === Gallery Section === */}
          <Accordion header="Gallery Images" buttonAppearance="outline">
            <GallerySection galleryUploaderProps={galleryUploaderProps} />
          </Accordion>

          <Divider thickness="2px" />

          <Flex justify="end">
            <Button type="submit" color="primary" loading={isSubmitting} onClick={handleSubmit}>
              Save All Changes
            </Button>
          </Flex>
        </Flex>
      </Card>
    </AdminLayout>
  );
};

export default HomePageContent;
