import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { apiClient } from '../../api/apiClient';
import {
  StringInput,
  Button,
  Flex,
  TextArea,
  Select,
  Option,
  FieldWrapper,
  Heading,
  FileUpload,
  Card,
} from '@baby-toys/ui-kit/components';
import { KeyValueArrayInput, StringArrayInput } from '@baby-toys/ui-kit/components';
import { Product } from '@baby-toys/types/src';

const ProductFormPage: React.FC = () => {
  const {
    getProductById,
    addProduct,
    updateProduct,
    getCategories,
    getColors,
    getMaterials,
    getBrands,
  } = useMockAdminApi();
  const [product, setProduct] = useState<Partial<Product>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Product>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [categoriesData, colorsData, materialsData, brandsData, productData] =
        await Promise.all([
          apiClient.get(getCategories),
          apiClient.get(getColors),
          apiClient.get(getMaterials),
          apiClient.get(getBrands),
          id !== 'new' ? apiClient.get(getProductById, id) : Promise.resolve({ images: [] }),
        ]);

      setCategories(categoriesData);
      setColors(colorsData);
      setMaterials(materialsData);
      setBrands(brandsData);
      setProduct(productData);

      if (productData.images?.length) {
        setImages(productData.images);
        const main =
          productData.mainImage && productData.images.find((i) => i.name === productData.mainImage);
        setMainImage(main || null);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // Only checks required fields for enabling submit button
    const valid =
      !!product.name &&
      !!product.price &&
      !!product.categoryId &&
      !!product.availableInStock &&
      !!product.shortDescription;
    setIsFormValid(valid);
  }, [product]);

  const handleChange = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Partial<Product> = {};
    if (!product.name) newErrors.name = 'Name is required';
    if (!product.price) newErrors.price = 'Price is required';
    if (!product.categoryId) newErrors.categoryId = 'Category is required';
    if (!product.availableInStock) newErrors.availableInStock = 'Stock is required';
    if (!product.shortDescription) newErrors.shortDescription = 'Short description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const productData = {
      ...product,
      images,
      mainImage: mainImage?.name || '',
    };

    if (id === 'new') {
      await apiClient.post(addProduct, productData);
    } else {
      await apiClient.put(updateProduct, productData);
    }

    navigate('/products');
  };

  if (isLoading) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="xl">
        <Heading>{id === 'new' ? 'Add' : 'Edit'} Product</Heading>
        <Flex spacing="xl" fullWidth align="stretch">
          <Card fullWidth>
            <Flex direction="vertical" spacing="xxl" fullWidth>
              <FieldWrapper fullWidth label="Product name" error={errors.name}>
                <StringInput
                  fullWidth
                  value={product.name || ''}
                  onChange={(v) => handleChange('name', v)}
                  placeholder="Enter product name"
                />
              </FieldWrapper>

              <FieldWrapper fullWidth label="Short Description" error={errors.shortDescription}>
                <TextArea
                  value={product.shortDescription || ''}
                  onChange={(v) => handleChange('shortDescription', v)}
                  placeholder="Enter a short description"
                />
              </FieldWrapper>

              <FieldWrapper fullWidth label="Description" error={errors.description}>
                <TextArea
                  value={product.description || ''}
                  onChange={(v) => handleChange('description', v)}
                  placeholder="Enter a full description"
                />
              </FieldWrapper>
              <FieldWrapper fullWidth label="Product Details">
                <KeyValueArrayInput
                  value={product.details || []}
                  min={1}
                  onChange={(v) => handleChange('details', v)}
                  fields={[
                    { key: 'label', placeholder: 'Label (e.g. Weight)' },
                    { key: 'value', placeholder: 'Value (e.g. 2kg)' },
                  ]}
                  addButtonText="Add detail"
                  fullwidth
                />
              </FieldWrapper>
              <FieldWrapper fullWidth label="Feature Bullets">
                <StringArrayInput
                  fullwidth
                  value={product.featureBullets || ['']}
                  onChange={(v) => handleChange('featureBullets', v)}
                  placeholder="Add feature bullet"
                  addButtonText="Add feature bullet"
                  min={1}
                />
              </FieldWrapper>

              <FieldWrapper fullWidth label="Price" error={errors.price}>
                <StringInput
                  type="number"
                  fullWidth
                  value={product.price || ''}
                  onChange={(v) => handleChange('price', Number(v))}
                />
              </FieldWrapper>
            </Flex>
          </Card>

          <Card fullWidth>
            <Flex direction="vertical" spacing="xxl" fullWidth>
              <FieldWrapper fullWidth label="Upload images">
                <FileUpload
                  multiple
                  onSelect={(e) => setImages(e.files)}
                  onRemove={(e) => setImages(images.filter((f) => f.name !== e.file.name))}
                />
              </FieldWrapper>

              <FieldWrapper fullWidth label="Select main image">
                <Select
                  fullWidth
                  value={mainImage?.name || ''}
                  isDisabled={!images.length}
                  onChange={(v) => setMainImage(images.find((f) => f.name === v) || null)}
                >
                  {images.map((file) => (
                    <Option key={file.name} value={file.name}>
                      {file.name}
                    </Option>
                  ))}
                </Select>
              </FieldWrapper>

              <FieldWrapper fullWidth label="Category" error={errors.categoryId}>
                <Select
                  fullWidth
                  value={product.categoryId || ''}
                  onChange={(v) => handleChange('categoryId', v)}
                >
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </FieldWrapper>

              <FieldWrapper fullWidth label="Brand">
                <Select
                  multiple
                  fullWidth
                  value={product.brand || []}
                  onChange={(v) => handleChange('brand', v)}
                >
                  {brands.map((cat) => (
                    <Option key={cat.value} value={cat.value}>
                      {cat.label}
                    </Option>
                  ))}
                </Select>
              </FieldWrapper>

              <FieldWrapper fullWidth label="Color">
                <Select
                  multiple
                  fullWidth
                  value={product.color || []}
                  onChange={(v) => handleChange('color', v)}
                >
                  {colors.map((cat) => (
                    <Option key={cat.value} value={cat.value}>
                      {cat.label}
                    </Option>
                  ))}
                </Select>
              </FieldWrapper>

              <FieldWrapper fullWidth label="Material">
                <Select
                  multiple
                  fullWidth
                  value={product.material || []}
                  onChange={(v) => handleChange('material', v)}
                >
                  {materials.map((cat) => (
                    <Option key={cat.value} value={cat.value}>
                      {cat.label}
                    </Option>
                  ))}
                </Select>
              </FieldWrapper>

              <FieldWrapper fullWidth label="Available In Stock" error={errors.availableInStock}>
                <StringInput
                  type="number"
                  fullWidth
                  value={product.availableInStock || ''}
                  onChange={(v) => handleChange('availableInStock', Number(v))}
                />
              </FieldWrapper>
            </Flex>
          </Card>
        </Flex>

        <Button onClick={handleSubmit} isDisabled={!isFormValid}>
          Submit
        </Button>
      </Flex>
    </AdminLayout>
  );
};

export default ProductFormPage;
