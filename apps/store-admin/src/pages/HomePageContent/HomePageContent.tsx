import React from 'react';
import {
  Card,
  Flex,
  Accordion,
  StringInput,
  TextArea,
  Button,
  ImageUploader,
} from '@baby-toys/ui-kit';
import { useHomePageContentForm } from './useHomePageContentForm';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';

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
        <Flex direction="column" spacing="xxl" fullWidth>
          <Accordion
            header="Info Cards"
            buttonAppearance="outline"
            buttonColor={errors?.infoCards && 'error'}
          >
            {infoCards.map((card, i) => (
              <Card key={card.id || i} fullWidth variant="outlined" className="bts-marginTm">
                <Flex direction="column" spacing="m" fullWidth>
                  <FormFieldWrapper
                    name={`infoCards.${i}.icon`}
                    control={control}
                    label="Icon"
                    fullWidth
                  >
                    <StringInput />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    name={`infoCards.${i}.title`}
                    control={control}
                    label="Title"
                    fullWidth
                  >
                    <StringInput />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    fullWidth
                    name={`infoCards.${i}.subtitle`}
                    control={control}
                    label="Subtitle"
                  >
                    <TextArea />
                  </FormFieldWrapper>
                </Flex>
              </Card>
            ))}
          </Accordion>

          <Accordion
            header="Hero Banners"
            buttonAppearance="outline"
            buttonColor={errors?.heroBanners && 'error'}
          >
            <Flex direction="column" spacing="m" fullWidth>
              {heroBanners.map((banner, i) => (
                <FormFieldWrapper
                  fullWidth
                  key={banner.id || i}
                  name={`heroBanners.${i}.text`}
                  control={control}
                  label={`Banner ${i + 1}`}
                >
                  <TextArea />
                </FormFieldWrapper>
              ))}
            </Flex>
          </Accordion>

          <Accordion header="Gallery Images" buttonAppearance="outline">
            <ImageUploader
              {...galleryUploaderProps}
              maxFileSizeMB={10}
              accept="image/jpeg,image/png,image/webp"
              showPreview
            />
          </Accordion>

          <Flex justify="flex-end">
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
