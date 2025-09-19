import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@baby-toys/ui-kit/components';
import { defaultProductValues, productSchema } from './product.helper';
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
  uploadMainImage,
  uploadProductImage,
  useDeleteProductImage,
} from '../../api/productApi';
import { useCategories } from '../../api/categoryApi';
import { useBrands } from '../../api/brandApi';
import { useColors } from '../../api/colorApi';
import { useMaterials } from '../../api/materialApi';
import { useParams } from 'react-router-dom';

type ProductFormValues = z.infer<typeof productSchema>;

export const useProductForm = () => {
  const toast = useToast();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { id: productId } = useParams<{ id?: string }>();
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: colors = [] } = useColors();
  const { data: materials = [] } = useMaterials();
  const deleteImageMutation = useDeleteProductImage(Number(productId));

  // Separate existing images (URLs) and new images (File)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (product) {
      setExistingImages(product.images || []);
      setMainImageUrl(product.mainImage || null);

      const detailsArray = product.details
        ? Object.entries(product.details).map(([label, value]) => ({
            label,
            value: String(value),
          }))
        : [];

      const defaultValues = {
        ...defaultProductValues,
        ...product,
        details: detailsArray,
        featureBullets: product.featureBullets?.length ? product.featureBullets : [''],
        images: product.images || [],
        mainImage: product.mainImage || '',
        colorIds: product.colorIds || [],
        materialIds: product.materialIds || [],
        categoryId: product.categoryId ?? undefined,
        brandId: product.brandId ?? undefined,
      };

      reset(defaultValues);
      setNewImages([]);
      setMainImageFile(null);
    } else {
      reset(defaultProductValues);
      setExistingImages([]);
      setNewImages([]);
      setMainImageUrl(null);
      setMainImageFile(null);
    }
  }, [product, reset]);

  const submitForm = async (data: ProductFormValues) => {
    try {
      if (!mainImageUrl && !mainImageFile) {
        toast.error('Please upload a main image');
        return;
      }

      const detailsObject = (data.details || []).reduce<Record<string, string>>((acc, item) => {
        if (item?.label) acc[item.label] = String(item.value || '');
        return acc;
      }, {});

      const payload = {
        ...data,
        featureBullets: data.featureBullets.map((f) => f.trim()).filter(Boolean),
        images: existingImages,
        details: detailsObject,
        mainImage: mainImageUrl || '',
      };

      const result = productId
        ? await updateProduct.mutateAsync({ id: productId, ...payload })
        : await createProduct.mutateAsync(payload);

      const newProductId = productId || result.data.id;

      if (mainImageFile) {
        await uploadMainImage(newProductId, mainImageFile);
      }

      for (const file of newImages) {
        await uploadProductImage(newProductId, file);
      }

      toast.success(`Product ${productId ? 'updated' : 'created'} successfully`);
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const mainImageUploaderProps = {
    images: mainImageFile ? [mainImageFile] : mainImageUrl ? [mainImageUrl] : [],
    multiple: false,
    onBackendDelete: async (url: string) => {
      if (!productId) return;
      setIsDeletingImage(true);
      try {
        await deleteImageMutation.mutateAsync(url);
        setMainImageUrl(null);
      } catch (error) {
        console.error('Error deleting main image:', error);
        throw error;
      } finally {
        setIsDeletingImage(false);
      }
    },
    onImagesChange: (files: (File | string)[]) => {
      const file = files[0];
      if (file instanceof File) {
        setMainImageFile(file);
        setMainImageUrl(null);
      } else if (typeof file === 'string') {
        setMainImageUrl(file);
        setMainImageFile(null);
      }
    },
  };

  const imageUploaderProps = {
    images: [...existingImages, ...newImages],
    multiple: true,
    onBackendDelete: async (url: string) => {
      if (!productId) return;
      setIsDeletingImage(true);
      try {
        await deleteImageMutation.mutateAsync(url);
        setExistingImages((imgs) => imgs.filter((img) => img !== url));
      } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
      } finally {
        setIsDeletingImage(false);
      }
    },
    onImagesChange: (files: (File | string)[]) => {
      const urls: string[] = [];
      const filesArr: File[] = [];
      files.forEach((f) => {
        if (f instanceof File) filesArr.push(f);
        else urls.push(f);
      });
      setExistingImages(urls);
      setNewImages(filesArr);
    },
  };

  return {
    control,
    handleSubmit: handleSubmit(submitForm),
    isSubmitting,
    isLoadingProduct,
    categories,
    brands,
    colors,
    materials,
    existingImages,
    setExistingImages,
    newImages,
    setNewImages,
    mainImageUrl,
    setMainImageUrl,
    mainImageFile,
    setMainImageFile,
    isEditMode: !!productId,
    isDeletingImage,
    imageUploaderProps,
    mainImageUploaderProps,
  };
};
