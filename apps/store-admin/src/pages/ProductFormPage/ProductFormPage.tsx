import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  Divider
} from '@baby-toys/ui-kit';

import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import LocalizedFields from './LocalizedFields';

import { useProductForm } from './useProductForm';
import { useProduct } from '../../api/productApi';

import { useAttributeTypes } from '../../api/attributeApi';
import ProductVariations from '../ProductVariations/ProductVariations';

import styles from './Productsform.module.scss';
import AttributesSection from './AttributesSection.tsx';
import OptionsSection from './OptionsSection.tsx';

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const pid = id ? Number(id) : undefined;

  const { data: productForTabs } = useProduct(pid);
  const { data: attributeTypes = [] } = useAttributeTypes();

  const {
    control,
    handleSubmit,
    isSubmitting,
    isLoadingProduct,
    categories,
    isEditMode,
    imageUploaderProps,
    mainImageUploaderProps,
    isDeletingImage,
    setValue,
  } = useProductForm();

  if (isLoadingProduct) {
    return <AdminLayout>{t('app.loading')}</AdminLayout>;
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m">
        <Heading>{isEditMode ? t('productForm.editTitle') : t('productForm.addTitle')}</Heading>
        <AccordionGroup fullWidth withDivider>
          <Accordion header={t('productForm.tab.general', { defaultValue: 'General' })} defaultOpen>
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
            <div className={styles.productsFormGeneral}>
              <FormFieldWrapper label={t('productForm.mainImage')} fullWidth required>
                <ImageUploader {...mainImageUploaderProps} fullHeight />
              </FormFieldWrapper>

              <FormFieldWrapper label={t('productForm.galleryImages')} fullWidth>
                <ImageUploader {...imageUploaderProps} fullHeight />
              </FormFieldWrapper>
            </div>
          </Accordion>

          <Accordion header={t('productForm.tab.options')}>
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
              <Heading level="h4">{t('productForm.attributes')}</Heading>
              <AttributesSection
                control={control}
                attributeTypes={attributeTypes}
                isDisabled={isDeletingImage}
                setValue={setValue}
              />
              <Divider />
              <Heading level="h4">{t('productForm.options')}</Heading>
              <OptionsSection control={control} isDisabled={isDeletingImage} setValue={setValue} />
            </Flex>
          </Accordion>

          <Accordion header={t('productForm.tab.variations', { defaultValue: 'Variations' })}>
            <div className={styles.productsFormGeneral}>
              <ProductVariations
                productId={pid}
                productOptions={(productForTabs as any)?.options || []}
              />
            </div>
          </Accordion>
        </AccordionGroup>
        <Button onClick={handleSubmit} isDisabled={isSubmitting || isDeletingImage}>
          {t('app.submit')}
        </Button>
      </Flex>
    </AdminLayout>
  );
};

export default ProductFormPage;
