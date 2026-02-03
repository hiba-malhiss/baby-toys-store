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

import ProductAttribute from './ProductAttribute.tsx';
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
    brands,
    colors,
    materials,
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

                  <FormFieldWrapper
                    name="brandId"
                    control={control}
                    label={t('productForm.brand')}
                    fullWidth
                  >
                    <Select fullWidth isDisabled={isDeletingImage}>
                      {brands.map((b) => (
                        <Option key={b.id} value={b.id}>
                          {b.name}
                        </Option>
                      ))}
                    </Select>
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    name="colorIds"
                    control={control}
                    label={t('productForm.colors')}
                    fullWidth
                  >
                    <Select multiple fullWidth isDisabled={isDeletingImage}>
                      {colors.map((c) => (
                        <Option key={c.id} value={c.id}>
                          {c.name} - {c.code}
                        </Option>
                      ))}
                    </Select>
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    name="materialIds"
                    control={control}
                    label={t('productForm.materials')}
                    fullWidth
                  >
                    <Select multiple fullWidth isDisabled={isDeletingImage}>
                      {materials.map((m) => (
                        <Option key={m.id} value={m.id}>
                          {m.name}
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
              <ProductAttribute productId={pid} />
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
