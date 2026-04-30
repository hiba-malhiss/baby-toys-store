import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Option,
  ImageUploader,
  Accordion,
  AccordionGroup,
  Divider,
  ImagePickerModal,
} from '@baby-toys/ui-kit';

import { Layers } from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import LocalizedFields from './LocalizedFields';

import { useProductForm } from './useProductForm';
import { useAttributeTypes } from '../../api/attributeApi';

import styles from './Productsform.module.scss';
import AttributesSection from './components/AttributesSection.tsx';
import OptionsSection from './components/OptionsSection.tsx';
import HelpTooltip from '../../components/HelpTooltip';
import ProductRelationshipDiagram from '../../components/ProductRelationshipDiagram';

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: attributeTypes = [] } = useAttributeTypes();

  const {
    control,
    handleSubmit,
    isSubmitting,
    isLoadingProduct,
    categories,
    isEditMode,
    productId,
    unifiedUploaderProps,
    allImages,
    mainImageUrl,
    handleMainImageSelect,
    isDeletingImage,
    setValue,
  } = useProductForm();

  if (isLoadingProduct) {
    return <AdminLayout>{t('app.loading')}</AdminLayout>;
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit}>
        <Flex direction="vertical" spacing="m">
          <Flex justify="between" align="center" fullWidth>
            <Heading>{isEditMode ? t('productForm.editTitle') : t('productForm.addTitle')}</Heading>
            {isEditMode && productId && (
              <Button
                type="button"
                appearance="outline"
                leftIconComp={Layers}
                onClick={() => navigate(`/edit-product/${productId}/variations`)}
              >
                {t('productForm.manageVariations', { defaultValue: 'Manage Variations' })}
              </Button>
            )}
          </Flex>

          <AccordionGroup fullWidth withDivider>
            <Accordion
              header={t('productForm.tab.general', { defaultValue: 'General' })}
              defaultOpen
            >
              <div className={styles.productsFormGeneral}>
                <Card fullWidth>
                  <Flex direction="vertical" spacing="m" fullWidth>
                    <Heading level="h4">AR</Heading>
                    <LocalizedFields
                      control={control}
                      locale={'ar' as any}
                      isDisabled={isDeletingImage}
                    />
                  </Flex>
                </Card>

                <Card fullWidth>
                  <Flex direction="vertical" spacing="m" fullWidth>
                    <Heading level="h4">EN</Heading>
                    <LocalizedFields
                      control={control}
                      locale={'en' as any}
                      isDisabled={isDeletingImage}
                    />
                  </Flex>
                </Card>
              </div>
            </Accordion>

            <Accordion header={t('productForm.tab.media', { defaultValue: 'Media' })}>
              <Flex direction="vertical" spacing="m" fullWidth>
                {/* Single unified uploader for all images */}
                <FormFieldWrapper
                  label={t('productForm.galleryImages', { defaultValue: 'Product Images' })}
                  fullWidth
                >
                  <ImageUploader {...unifiedUploaderProps} fullHeight maxImages={10} />
                </FormFieldWrapper>

                {/* Main image selector */}
                <ImagePickerModal
                  images={allImages}
                  value={mainImageUrl}
                  onChange={handleMainImageSelect}
                  label={t('productForm.mainImage', { defaultValue: 'Main Image' })}
                  placeholder={t('productForm.selectMainImage', {
                    defaultValue: 'Select Main Image',
                  })}
                  title={t('productForm.selectMainImage', { defaultValue: 'Select Main Image' })}
                  disabled={isDeletingImage}
                  status="default"
                />
              </Flex>
            </Accordion>

            <Accordion
              header={
                <Flex align="center" spacing="m">
                  <span>{t('productForm.options')}</span>
                  <ProductRelationshipDiagram />
                </Flex>
              }
            >
              <Flex direction="vertical" spacing="xxl">
                <FormFieldWrapper
                  name="categoryId"
                  control={control}
                  label={t('productForm.category')}
                  fullWidth
                >
                  <Select fullWidth isDisabled={isDeletingImage}>
                    {categories.map((cat) => (
                      <Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </FormFieldWrapper>
                <Divider />
                <Flex align="center">
                  <Heading level="h4">{t('productForm.attributes')}</Heading>
                  <HelpTooltip
                    title={t('productForm.attributesHelp', {
                      defaultValue: 'What are Attributes?',
                    })}
                    description={t('productForm.attributesHelp', {
                      defaultValue:
                        'Attributes describe fixed specs (Material, Brand). They appear on the product page and can be used for filtering. Set up Attribute Types first in the Attributes menu.',
                    })}
                    position="top"
                  />
                </Flex>
                <AttributesSection
                  control={control}
                  attributeTypes={attributeTypes}
                  isDisabled={isDeletingImage}
                  setValue={setValue}
                />
                <Divider />
                <Flex align="center">
                  <Heading level="h4">{t('productForm.options')}</Heading>
                  <HelpTooltip
                    title={t('productForm.optionsHelp', { defaultValue: 'What are Options?' })}
                    description={t('productForm.optionsHelp', {
                      defaultValue:
                        'Options create purchasable variants (Size, Color). Set up Option Types first in the Options menu, then assign values here to generate variants.',
                    })}
                    position="top"
                  />
                </Flex>
                <OptionsSection
                  control={control}
                  isDisabled={isDeletingImage}
                  setValue={setValue}
                />
              </Flex>
            </Accordion>
          </AccordionGroup>
          <Button
            type="submit"
            isDisabled={isSubmitting || isDeletingImage}
            isLoading={isSubmitting || isDeletingImage}
          >
            {t('app.submit')}
          </Button>
        </Flex>
      </form>
    </AdminLayout>
  );
};

export default ProductFormPage;
