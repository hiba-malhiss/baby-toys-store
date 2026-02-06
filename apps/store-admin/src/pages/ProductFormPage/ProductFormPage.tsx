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
} from '@baby-toys/ui-kit';

import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import LocalizedFields from './LocalizedFields';

import { useProductForm } from './useProductForm';
import { useProduct } from '../../api/productApi';

import ProductOptions from './ProductOptions.tsx';
import ProductVariations from '../ProductVariations/ProductVariations';

import styles from './Productsform.module.scss';

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const pid = id ? Number(id) : undefined;

  const { data: productForTabs } = useProduct(pid);

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
                  <LocalizedFields control={control} locale={'ar' as any} isDisabled={isDeletingImage} />
                </Flex>
              </Card>

              <Card fullWidth>
                <Flex direction="vertical" spacing="m" fullWidth>
                  <Heading level="h4">EN</Heading>
                  <LocalizedFields control={control} locale={'en' as any} isDisabled={isDeletingImage} />
                </Flex>
              </Card>

              <Card fullWidth>
                <Flex direction="vertical" spacing="xxl" fullWidth>
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

          <Accordion header={t('productForm.tab.options', { defaultValue: 'Product Options' })}>
            <div className={styles.productsFormGeneral}>
              {pid != null && <ProductOptions productId={pid as number} />}
            </div>
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
