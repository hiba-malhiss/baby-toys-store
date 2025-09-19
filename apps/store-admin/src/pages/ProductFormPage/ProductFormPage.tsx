import React from 'react';
import { Flex, Heading, Button, Card } from '@baby-toys/ui-kit/components';
import {
  StringInput,
  TextArea,
  StringArrayInput,
  KeyValueArrayInput,
  Select,
  Option,
  ImageUploader,
} from '@baby-toys/ui-kit/components';
import { useProductForm } from './useProductForm';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';

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
          {/* Left Card - Product Details */}
          <Card fullWidth>
            <Flex direction="vertical" spacing="xxl" fullWidth>
              <FormFieldWrapper
                name="name"
                control={control}
                label="Product name"
                fullWidth
                required
              >
                <StringInput placeholder="Enter product name" disabled={isDeletingImage} />
              </FormFieldWrapper>

              <FormFieldWrapper
                name="shortDescription"
                control={control}
                label="Short Description"
                fullWidth
                required
              >
                <TextArea placeholder="Enter a short description" disabled={isDeletingImage} />
              </FormFieldWrapper>

              <FormFieldWrapper name="description" control={control} label="Description" fullWidth>
                <TextArea placeholder="Enter a full description" disabled={isDeletingImage} />
              </FormFieldWrapper>

              <FormFieldWrapper name="details" control={control} label="Product Details" fullWidth>
                <KeyValueArrayInput
                  keyPlaceholder="Label"
                  valuePlaceholder="Value"
                  addButtonText="Add detail"
                  fullWidth
                  disabled={isDeletingImage}
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                name="featureBullets"
                control={control}
                label="Feature Bullets"
                fullWidth
              >
                <StringArrayInput
                  placeholder="Add bullet"
                  addButtonText="Add bullet"
                  min={1}
                  fullWidth
                  disabled={isDeletingImage}
                />
              </FormFieldWrapper>

              <FormFieldWrapper name="price" control={control} label="Price" fullWidth required>
                <StringInput type="number" disabled={isDeletingImage} />
              </FormFieldWrapper>

              <FormFieldWrapper
                name="stockQuantity"
                control={control}
                label="Stock Quantity"
                fullWidth
                required
              >
                <StringInput type="number" disabled={isDeletingImage} />
              </FormFieldWrapper>
            </Flex>
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

              {/* Category */}
              <FormFieldWrapper name="categoryId" control={control} label="Category" fullWidth>
                <Select fullWidth disabled={isDeletingImage}>
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>

              {/* Brand */}
              <FormFieldWrapper name="brandId" control={control} label="Brand" fullWidth>
                <Select fullWidth disabled={isDeletingImage}>
                  {brands.map((b) => (
                    <Option key={b.id} value={b.id}>
                      {b.name}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>

              {/* Colors */}
              <FormFieldWrapper name="colorIds" control={control} label="Colors" fullWidth>
                <Select multiple fullWidth disabled={isDeletingImage}>
                  {colors.map((c) => (
                    <Option key={c.id} value={c.id}>
                      {c.name} - {c.code}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>

              {/* Materials */}
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
