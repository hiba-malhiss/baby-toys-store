import React from 'react';
import { Flex, Heading, Button, Card, TabBar, TabBarItem } from '@baby-toys/ui-kit';
import { StringInput, Select, Option, ImageUploader } from '@baby-toys/ui-kit';
import { useProductForm } from './useProductForm';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import LocalizedFields from './LocalizedFields';
import { getSupportedLocales } from "../../i18n/locale.ts";
import { useTranslation } from 'react-i18next';

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation();
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

  if (isLoadingProduct) return <AdminLayout>{t('app.loading')}</AdminLayout>;

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m">
        <Heading>{isEditMode ? t('productForm.editTitle') : t('productForm.addTitle')}</Heading>
        <Flex spacing="xl" fullWidth align="stretch">
          {/* Left Card - Product Details (Localized with TabBar) */}
          <Card fullWidth>
            <TabBar
              tabs={getSupportedLocales().map((l) => ({
                header: `${l.toUpperCase()} (${l})`,
                value: l,
              }))}
              defaultSelected={getSupportedLocales()[0]}
            >
              {getSupportedLocales().map((l) => (
                <TabBarItem key={l} value={l}>
                  <LocalizedFields
                    control={control}
                    locale={l as any}
                    isDisabled={isDeletingImage}
                  />
                </TabBarItem>
              ))}
            </TabBar>
          </Card>

          {/* Right Card - Images & Meta */}
          <Card fullWidth>
            <Flex direction="vertical" spacing="xxl" fullWidth>
              {/* Main Image */}
              <FormFieldWrapper
                label={t('productForm.mainImage')}
                fullWidth
                isDisabled={isDeletingImage}
                required
              >
                <ImageUploader {...mainImageUploaderProps} />
              </FormFieldWrapper>

              {/* Gallery Images */}
              <FormFieldWrapper
                label={t('productForm.galleryImages')}
                fullWidth
                isDisabled={isDeletingImage}
              >
                <ImageUploader {...imageUploaderProps} />
              </FormFieldWrapper>

              <Flex spacing="l" fullWidth align="center">
                <FormFieldWrapper
                  name="price"
                  control={control}
                  label={t('productForm.price')}
                  fullWidth
                  required
                >
                  <StringInput type="number" min={0} isDisabled={isDeletingImage} />
                </FormFieldWrapper>
                <FormFieldWrapper
                  name="costPrice"
                  control={control}
                  label={t('productForm.costPrice')}
                  fullWidth
                >
                  <StringInput type="number" min={0} isDisabled={isDeletingImage} />
                </FormFieldWrapper>
                <FormFieldWrapper
                  name="oldPrice"
                  control={control}
                  label={t('productForm.oldPrice')}
                  fullWidth
                >
                  <StringInput type="number" min={0} isDisabled={isDeletingImage} />
                </FormFieldWrapper>
              </Flex>

              <FormFieldWrapper
                name="stockQuantity"
                control={control}
                label={t('productForm.stockQuantity')}
                fullWidth
                required
              >
                <StringInput type="number" isDisabled={isDeletingImage} />
              </FormFieldWrapper>

              {/* Category (non-localized) */}
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

              {/* Brand (non-localized) */}
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

              {/* Colors (non-localized) */}
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

              {/* Materials (non-localized) */}
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
        </Flex>
        <Button onClick={handleSubmit} isDisabled={isSubmitting || isDeletingImage}>
          {t('app.submit')}
        </Button>
      </Flex>
    </AdminLayout>
  );
};

export default ProductFormPage;
