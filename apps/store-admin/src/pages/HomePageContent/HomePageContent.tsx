import { Card, Flex, Accordion, Button, Divider, TabBar, TabBarItem } from '@baby-toys/ui-kit';
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
              tabs={[
                { header: 'English (en)', value: 'en-banner' },
                { header: 'Arabic (ar)', value: 'ar-banner' },
              ]}
            >
              <TabBarItem value="en-banner">
                <HeroBannersSection locale="en" control={control} heroBanners={heroBanners} />
              </TabBarItem>
              <TabBarItem value="ar-banner">
                <HeroBannersSection locale="ar" control={control} heroBanners={heroBanners} />
              </TabBarItem>
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
              tabs={[
                { header: 'English (en)', value: 'en-info' },
                { header: 'Arabic (ar)', value: 'ar-info' },
              ]}
            >
              <TabBarItem value="en-info">
                <InfoCardsSection locale="en" control={control} infoCards={infoCards} />
              </TabBarItem>
              <TabBarItem value="ar-info">
                <InfoCardsSection locale="ar" control={control} infoCards={infoCards} />
              </TabBarItem>
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
