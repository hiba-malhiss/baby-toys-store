import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@baby-toys/ui-kit';
import { defaultProductValues, productSchema } from './product.helper';
import { useWatch } from 'react-hook-form';
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

  // Max constraints for counters
  const MAX = {
    name: 255,
    shortDescription: 500,
    description: 2000,
    featureBullet: 255,
    featureBulletsCount: 10,
    detailsLabel: 100,
    detailsValue: 500,
    images: 10,
  } as const;

  // Live watchers for counters
  const watchNameEn = useWatch({ control, name: 'translations.en.name' });
  const watchShortDescriptionEn = useWatch({ control, name: 'translations.en.shortDescription' });
  const watchDescriptionEn = useWatch({ control, name: 'translations.en.description' });
  const watchFeatureBulletsEn = useWatch({ control, name: 'translations.en.featureBullets' });
  const watchNameAr = useWatch({ control, name: 'translations.ar.name' });
  const watchShortDescriptionAr = useWatch({ control, name: 'translations.ar.shortDescription' });
  const watchDescriptionAr = useWatch({ control, name: 'translations.ar.description' });
  const watchFeatureBulletsAr = useWatch({ control, name: 'translations.ar.featureBullets' });

  // Pre-fill form when editing
  useEffect(() => {
    if (product) {
      setExistingImages(product.images || []);
      setMainImageUrl(product.mainImage || null);
      
      // Build locale maps from admin translations
      const trMap = new Map<string, any>();
      (product as any).translations?.forEach((t: any) => {
        if (t?.locale) trMap.set(String(t.locale).toLowerCase(), t);
      });
      const enTr = trMap.get('en') || {};
      const arTr = trMap.get('ar') || {};

      const detailsArrayEn = enTr.details
        ? Object.entries(enTr.details as Record<string, string>).map(([label, value]) => ({
            label,
            value: String(value),
          }))
        : [];
      const detailsArrayAr = arTr.details
        ? Object.entries(arTr.details as Record<string, string>).map(([label, value]) => ({
            label,
            value: String(value),
          }))
        : [];

      const defaultValues: ProductFormValues = {
        ...defaultProductValues,
        // non-localized
        price: product.price as unknown as number,
        oldPrice: (product.oldPrice as number | null) ?? undefined,
        stockQuantity: product.stockQuantity as unknown as number,
        releaseDate: product.releaseDate || '',
        images: product.images || [],
        mainImage: product.mainImage || '',
        isActive: product.isActive ?? true,
        colorIds: product.colorIds || [],
        materialIds: product.materialIds || [],
        categoryId: product.categoryId ?? undefined,
        brandId: product.brandId ?? undefined,
        // localized (prefill from admin translations)
        translations: {
          en: {
            name: enTr.name || '',
            shortDescription: enTr.shortDescription || '',
            description: enTr.description || '',
            featureBullets: Array.isArray(enTr.featureBullets) && enTr.featureBullets.length ? enTr.featureBullets : [''],
            details: detailsArrayEn,
          },
          ar: {
            name: arTr.name || '',
            shortDescription: arTr.shortDescription || '',
            description: arTr.description || '',
            featureBullets: Array.isArray(arTr.featureBullets) && arTr.featureBullets.length ? arTr.featureBullets : [''],
            details: detailsArrayAr,
          },
        },
      } as unknown as ProductFormValues;

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

      // Helper to sanitize a locale block
      const sanitizeLocale = (locale: 'en' | 'ar') => {
        const t = (data.translations as any)[locale] || {};
        const name = (t.name || '').trim().slice(0, MAX.name);
        const shortDescription = (t.shortDescription || '').trim().slice(0, MAX.shortDescription);
        const description = (t.description || '').trim().slice(0, MAX.description);
        const featureBullets = (t.featureBullets || [])
          .map((f: string) => (f || '').trim().slice(0, MAX.featureBullet))
          .filter(Boolean)
          .slice(0, MAX.featureBulletsCount);
        const detailsObj = (t.details || []).reduce<Record<string, string>>((acc: any, item: any) => {
          const key = (item?.label || '').trim().slice(0, MAX.detailsLabel);
          const val = (String(item?.value || '')).trim().slice(0, MAX.detailsValue);
          if (key) acc[key] = val;
          return acc;
        }, {});
        return { name, shortDescription, description, featureBullets, details: detailsObj };
      };

      const en = sanitizeLocale('en');
      const ar = sanitizeLocale('ar');

      const payload = {
        // non-localized
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        stockQuantity: data.stockQuantity,
        releaseDate: data.releaseDate || undefined,
        images: existingImages.slice(0, MAX.images),
        mainImage: mainImageUrl || '',
        isActive: data.isActive,
        categoryId: data.categoryId,
        brandId: data.brandId,
        materialIds: data.materialIds,
        colorIds: data.colorIds,
        // localized
        translations: [
          { locale: 'en', ...en },
          { locale: 'ar', ...ar },
        ],
      };

      const returnedId = productId
        ? await updateProduct.mutateAsync({ id: productId, ...payload })
        : await createProduct.mutateAsync(payload);

      const newProductId = productId || returnedId;

      if (mainImageFile) {
        await uploadMainImage(newProductId, mainImageFile);
      }

      for (const file of newImages) {
        await uploadProductImage(newProductId, file);
      }

      toast.success(`Product ${productId ? 'updated' : 'created'} successfully`);
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.message || 'Failed to save product';
      toast.error(backendMsg);
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
    // counters data
    counters: {
      en: {
        watchName: watchNameEn,
        watchShortDescription: watchShortDescriptionEn,
        watchDescription: watchDescriptionEn,
        watchFeatureBullets: watchFeatureBulletsEn,
      },
      ar: {
        watchName: watchNameAr,
        watchShortDescription: watchShortDescriptionAr,
        watchDescription: watchDescriptionAr,
        watchFeatureBullets: watchFeatureBulletsAr,
      },
      MAX,
    },
  };
};
