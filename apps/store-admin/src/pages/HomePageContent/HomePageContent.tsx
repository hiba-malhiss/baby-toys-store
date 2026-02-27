import {
  Card,
  Flex,
  Accordion,
  Button,
  Divider,
  TabBar,
  TabBarItem,
  ImageUploader,
} from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import { getSupportedLocales } from '../../i18n/locale';
import { useHomePageContentForm } from './useHomePageContentForm';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import BannersSection from './BannersSection';
import MainBannerSection from './MainBannerSection';
import InfoCardsSection from './InfoCardsSection';
import GallerySection from './GallerySection';

const HomePageContent: React.FC = () => {
  const { t } = useTranslation();
  const {
    control,
    banners,
    infoCards,
    mainBanners,
    galleryUploaderProps,
    banner1UploaderProps,
    banner2UploaderProps,
    mainBannerUploaderProps,
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
          {/* === Banners Section === */}
          <Accordion
            header={t('homepage.sections.banners')}
            buttonAppearance="outline"
            buttonColor={errors?.banners && 'error'}
          >
            <Flex direction="vertical" spacing="xl" fullWidth>
              {/* Banner 1 */}
              <Flex direction="vertical" spacing="l" fullWidth>
                <TabBar
                  fullWidth
                  size="small"
                  tabs={locales.map((l) => ({
                    header: `${l.toUpperCase()} (${l})`,
                    value: `${l}-banner1`,
                  }))}
                >
                  {locales.map((l) => (
                    <TabBarItem key={l} value={`${l}-banner1`}>
                      <BannersSection
                        locale={l}
                        control={control}
                        banners={banners}
                        slotIndex={0}
                      />
                    </TabBarItem>
                  ))}
                </TabBar>
                <Divider />
                <ImageUploader
                  {...banner1UploaderProps}
                  maxFileSizeMB={10}
                  accept="image/jpeg,image/png,image/webp"
                  showPreview
                  maxFileSizeText={t('homepage.gallery.maxFileSize')}
                  acceptedFormatsText={t('homepage.gallery.acceptedFormats')}
                />
              </Flex>

              <Divider />

              {/* Banner 2 */}
              <Flex direction="vertical" spacing="l" fullWidth>
                <TabBar
                  fullWidth
                  size="small"
                  tabs={locales.map((l) => ({
                    header: `${l.toUpperCase()} (${l})`,
                    value: `${l}-banner2`,
                  }))}
                >
                  {locales.map((l) => (
                    <TabBarItem key={l} value={`${l}-banner2`}>
                      <BannersSection
                        locale={l}
                        control={control}
                        banners={banners}
                        slotIndex={1}
                      />
                    </TabBarItem>
                  ))}
                </TabBar>
                <Divider />
                <ImageUploader
                  {...banner2UploaderProps}
                  maxFileSizeMB={10}
                  accept="image/jpeg,image/png,image/webp"
                  showPreview
                  maxFileSizeText={t('homepage.gallery.maxFileSize')}
                  acceptedFormatsText={t('homepage.gallery.acceptedFormats')}
                />
              </Flex>
            </Flex>
          </Accordion>

          {/* === Main Banner Section === */}
          <Accordion header={t('homepage.sections.mainBanner')} buttonAppearance="outline">
            <Flex direction="vertical" spacing="l" fullWidth>
              <TabBar
                fullWidth
                size="small"
                tabs={locales.map((l) => ({
                  header: `${l.toUpperCase()} (${l})`,
                  value: `${l}-mainBanner`,
                }))}
              >
                {locales.map((l) => {
                  const idx = mainBanners.findIndex((mb: any) => (mb as any)?.locale === l);
                  const baseName = idx >= 0 ? `mainBanners.${idx}` : `mainBanners.0`;
                  return (
                    <TabBarItem key={l} value={`${l}-mainBanner`}>
                      <MainBannerSection control={control} baseName={baseName} />
                    </TabBarItem>
                  );
                })}
              </TabBar>
              <Divider />
              <ImageUploader
                {...mainBannerUploaderProps}
                maxFileSizeMB={10}
                accept="image/jpeg,image/png,image/webp"
                showPreview
                maxFileSizeText={t('homepage.gallery.maxFileSize')}
                acceptedFormatsText={t('homepage.gallery.acceptedFormats')}
              />
            </Flex>
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
