import React from 'react';
import {
  Card,
  Flex,
  Heading,
  StringInput,
  TextArea,
  Button,
  ImageUploader,
} from '@baby-toys/ui-kit/components';
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
  } = useHomePageContentForm();

  if (isLoading) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <Card header="Homepage Content" fullWidth>
        <Flex spacing="xxl" fullWidth wrap>
          {/* Info Cards */}
          <Flex direction="column" spacing="m">
            <Heading level="h3">Info Cards</Heading>
            {infoCards.map((card, i) => (
              <React.Fragment key={card.id || i}>
                <FormFieldWrapper name={`infoCards.${i}.title`} control={control} label="Title">
                  <StringInput />
                </FormFieldWrapper>
                <FormFieldWrapper
                  name={`infoCards.${i}.subtitle`}
                  control={control}
                  label="Subtitle"
                >
                  <TextArea />
                </FormFieldWrapper>
                <FormFieldWrapper name={`infoCards.${i}.icon`} control={control} label="Icon">
                  <StringInput />
                </FormFieldWrapper>
              </React.Fragment>
            ))}
          </Flex>

          {/* Hero Banners */}
          <Flex direction="column" spacing="m">
            <Heading level="h3">Hero Banners</Heading>
            {heroBanners.map((banner, i) => (
              <FormFieldWrapper
                key={banner.id || i}
                name={`heroBanners.${i}.text`}
                control={control}
                label={`Banner ${i + 1}`}
              >
                <TextArea />
              </FormFieldWrapper>
            ))}
          </Flex>

          {/* Gallery */}
          <FormFieldWrapper label="Gallery Images">
            <ImageUploader
              {...galleryUploaderProps}
              maxFileSizeMB={10}
              accept="image/jpeg,image/png,image/webp"
            />
          </FormFieldWrapper>
        </Flex>

        <Flex justify="flex-end" className="bts-marginTxl">
          <Button type="submit" color="primary" loading={isSubmitting} onClick={handleSubmit}>
            Save Changes
          </Button>
        </Flex>
      </Card>
    </AdminLayout>
  );
};

export default HomePageContent;
