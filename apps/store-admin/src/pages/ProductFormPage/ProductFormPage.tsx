import React from 'react';
import { Flex, Heading, Button, Card, TabBar, TabBarItem } from '@baby-toys/ui-kit';
import { StringInput, Select, Option, ImageUploader } from '@baby-toys/ui-kit';
import { useProductForm } from './useProductForm';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import LocalizedFields from './LocalizedFields';
import { getSupportedLocales } from '../../components/i18n/locale';

const ProductFormPage: React.FC = () => {
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

  if (isLoadingProduct) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m">
        <Heading>{isEditMode ? `Edit Product` : 'Add Product'}</Heading>
        <Flex spacing="xl" fullWidth align="stretch">
          {/* Left Card - Product Details (Localized with TabBar) */}
          <Card fullWidth>
            <TabBar
              tabs={getSupportedLocales().map((l) => ({ header: `${l.toUpperCase()} (${l})`, value: l }))}
              defaultSelected={getSupportedLocales()[0]}
            >
              {getSupportedLocales().map((l) => (
                <TabBarItem key={l} value={l}>
                  <LocalizedFields control={control} locale={l as any} isDisabled={isDeletingImage} />
                </TabBarItem>
              ))}
            </TabBar>
          </Card>

          {/* Right Card - Images & Meta */}
          <Card fullWidth>
            <Flex direction="vertical" spacing="xxl" fullWidth>
              {/* Main Image */}
              <FormFieldWrapper label="Main Image" fullWidth isDisabled={isDeletingImage} required>
                <ImageUploader {...mainImageUploaderProps} />
              </FormFieldWrapper>

              {/* Gallery Images */}
              <FormFieldWrapper label="Gallery Images" fullWidth isDisabled={isDeletingImage}>
                <ImageUploader {...imageUploaderProps} />
              </FormFieldWrapper>

              <Flex spacing="l" fullWidth>
                <FormFieldWrapper name="price" control={control} label="Price" fullWidth required>
                  <StringInput type="number" min={0} isDisabled={isDeletingImage} />
                </FormFieldWrapper>
                <FormFieldWrapper
                  name="oldPrice"
                  control={control}
                  label="Old Price (optional)"
                  fullWidth
                >
                  <StringInput type="number" min={0} isDisabled={isDeletingImage} />
                </FormFieldWrapper>
              </Flex>

              <FormFieldWrapper
                name="stockQuantity"
                control={control}
                label="Stock Quantity"
                fullWidth
                required
              >
                <StringInput type="number" disabled={isDeletingImage} />
              </FormFieldWrapper>

              {/* Category (non-localized) */}
              <FormFieldWrapper name="categoryId" control={control} label="Category" fullWidth>
                <Select fullWidth disabled={isDeletingImage}>
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>

              {/* Brand (non-localized) */}
              <FormFieldWrapper name="brandId" control={control} label="Brand" fullWidth>
                <Select fullWidth disabled={isDeletingImage}>
                  {brands.map((b) => (
                    <Option key={b.id} value={b.id}>
                      {b.name}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>

              {/* Colors (non-localized) */}
              <FormFieldWrapper name="colorIds" control={control} label="Colors" fullWidth>
                <Select multiple fullWidth disabled={isDeletingImage}>
                  {colors.map((c) => (
                    <Option key={c.id} value={c.id}>
                      {c.name} - {c.code}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>

              {/* Materials (non-localized) */}
              <FormFieldWrapper name="materialIds" control={control} label="Materials" fullWidth>
                <Select multiple fullWidth disabled={isDeletingImage}>
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
          Submit
        </Button>
      </Flex>
    </AdminLayout>
  );
};

export default ProductFormPage;
