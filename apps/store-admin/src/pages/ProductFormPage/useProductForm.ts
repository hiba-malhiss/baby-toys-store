import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@baby-toys/ui-kit';
import { defaultProductValues, productSchema } from './product.helper';
import { useTranslation } from 'react-i18next';
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
  uploadMainImage,
  uploadProductImage,
  useDeleteProductImage,
} from '../../api/productApi';
import { useCategories } from '../../api/categoryApi';
import { useParams } from 'react-router-dom';

type ProductFormValues = z.infer<typeof productSchema>;

export const useProductForm = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { id: productId } = useParams<{ id?: string }>();
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { data: categories = [] } = useCategories();
  const deleteImageMutation = useDeleteProductImage(Number(productId));

  // Separate existing images (URLs) and new images (File)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
    mode: 'onChange',
    criteriaMode: 'all',
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
      setMainImageFile(null);

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

      const optionsArray = Array.isArray((product as any).options)
        ? (product as any).options
            .map((o: any) => ({
              optionTypeId: Number(o?.type?.id),
              valueIds: Array.isArray(o?.values)
                ? o.values.map((v: any) => Number(v?.id)).filter(Number.isFinite)
                : [],
            }))
            .filter((x: any) => Number.isFinite(x.optionTypeId))
        : [];

      // Prefill product-level attributes for edit mode
      const attributesArray = Array.isArray((product as any).attributes)
        ? (product as any).attributes
            .map((a: any) => ({
              attributeTypeId: Number(a?.typeId),
              valueIds: Array.isArray(a?.values)
                ? a.values.map((v: any) => Number(v?.id)).filter(Number.isFinite)
                : [],
            }))
            .filter((x: any) => Number.isFinite(x.attributeTypeId))
        : [];

      const defaultValues: ProductFormValues = {
        ...defaultProductValues,
        options: optionsArray,
        attributes: attributesArray,
        // non-localized
        releaseDate: product.releaseDate || '',
        images: product.images || [],
        mainImage: product.mainImage || '',
        isActive: product.isActive ?? true,
        categoryId: product.categoryId ?? undefined,
        // localized (prefill from admin translations)
        translations: {
          en: {
            name: enTr.name || '',
            shortDescription: enTr.shortDescription || '',
            description: enTr.description || '',
            featureBullets:
              Array.isArray(enTr.featureBullets) && enTr.featureBullets.length
                ? enTr.featureBullets
                : [''],
            details: detailsArrayEn,
          },
          ar: {
            name: arTr.name || '',
            shortDescription: arTr.shortDescription || '',
            description: arTr.description || '',
            featureBullets:
              Array.isArray(arTr.featureBullets) && arTr.featureBullets.length
                ? arTr.featureBullets
                : [''],
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

  // Combined image pool for unified uploader
  const allImages: (File | string)[] = [...existingImages, ...newImages];

  const submitForm = async (data: ProductFormValues) => {
    try {
      if (!mainImageUrl && !mainImageFile) {
        toast.error('Please select a main image from the uploaded images');
        return;
      }

      const sanitizeLocale = (locale: 'en' | 'ar') => {
        const tr = (data.translations as any)[locale] || {};
        const name = (tr.name || '').trim().slice(0, MAX.name);
        const shortDescription = (tr.shortDescription || '').trim().slice(0, MAX.shortDescription);
        const description = (tr.description || '').trim().slice(0, MAX.description);
        const featureBullets = (Array.isArray(tr.featureBullets) ? tr.featureBullets : [])
          .map((f: unknown) =>
            String(f || '')
              .trim()
              .slice(0, MAX.featureBullet)
          )
          .filter(Boolean)
          .slice(0, MAX.featureBulletsCount);
        const detailsList: Array<{ label?: unknown; value?: unknown }> = Array.isArray(tr.details)
          ? (tr.details as Array<{ label?: unknown; value?: unknown }>)
          : [];
        const detailsObj = detailsList.reduce<Record<string, string>>((acc, item) => {
          const key = String(item?.label || '')
            .trim()
            .slice(0, MAX.detailsLabel);
          const val = String(item?.value || '')
            .trim()
            .slice(0, MAX.detailsValue);
          if (key) acc[key] = val;
          return acc;
        }, {});
        return { name, shortDescription, description, featureBullets, details: detailsObj };
      };

      const en = sanitizeLocale('en');
      const ar = sanitizeLocale('ar');

      const options = (data as any).options
        ? (data as any).options
            .filter((o: any) => o && o.optionTypeId)
            .map((o: any) => ({
              optionTypeId: Number(o.optionTypeId),
              valueIds: Array.isArray(o.valueIds) ? o.valueIds.map((v: any) => Number(v)) : [],
            }))
        : [];

      // Coerce attributes into backend shape with numeric IDs
      const attributes = (data as any).attributes
        ? (data as any).attributes
            .filter((a: any) => a && a.attributeTypeId)
            .map((a: any) => ({
              attributeTypeId: Number(a.attributeTypeId),
              valueIds: Array.isArray(a.valueIds) ? a.valueIds.map((v: any) => Number(v)) : [],
            }))
        : [];

      const payload = {
        // non-localized (variant-first)
        releaseDate: data.releaseDate || undefined,
        images: existingImages.slice(0, MAX.images),
        mainImage: mainImageFile ? '' : mainImageUrl || '',
        isActive: data.isActive,
        categoryId: data.categoryId,
        attributes,
        options,
        translations: [
          { locale: 'en', ...en },
          { locale: 'ar', ...ar },
        ],
      };

      const returnedId = productId
        ? await updateProduct.mutateAsync({ id: productId, ...payload })
        : await createProduct.mutateAsync(payload);

      const newProductId = productId || returnedId;

      // Upload new gallery images
      for (const file of newImages) {
        if (file !== mainImageFile) {
          await uploadProductImage(newProductId, file);
        }
      }

      // Upload main image if it's a new file
      if (mainImageFile) {
        await uploadMainImage(newProductId, mainImageFile);
      }

      toast.success(`Product ${productId ? 'updated' : 'created'} successfully`);
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.message || 'Failed to save product';
      toast.error(backendMsg);
    }
  };

  // Handle selection from image picker modal
  const handleMainImageSelect = (urlOrBlob: string) => {
    setMainImageUrl(urlOrBlob);
    // If it's a blob URL, find the matching File
    if (urlOrBlob.startsWith('blob:')) {
      const matchedFile = newImages.find((f) => urlOrBlob === URL.createObjectURL(f));
      setMainImageFile(matchedFile || null);
    } else {
      setMainImageFile(null);
    }
  };

  // Unified uploader handler
  const unifiedUploaderProps = {
    images: allImages,
    multiple: true,
    maxImages: MAX.images,
    onBackendDelete: async (url: string) => {
      if (!productId) return;

      // Block deletion if this is the main image
      if (mainImageUrl === url) {
        toast.error(
          'This image is currently set as the main image. Please choose a different main image first.'
        );
        // Throw to stop the uploader from removing it from the UI
        throw new Error('Cannot delete main image');
      }

      setIsDeletingImage(true);
      try {
        await deleteImageMutation.mutateAsync(url);
        setExistingImages((imgs) => imgs.filter((img) => img !== url));
      } catch (error: any) {
        const backendMsg =
          error?.response?.data?.message || error?.message || 'Failed to delete image';
        toast.error(backendMsg);
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

      // Clear main image if its backend URL was removed
      if (mainImageUrl && !mainImageUrl.startsWith('blob:')) {
        if (!urls.includes(mainImageUrl)) {
          setMainImageUrl(null);
          setMainImageFile(null);
        }
      }
    },
    isDisabled: isDeletingImage,
  };

  const onInvalid = () => {
    toast.error(t('app.formInvalid', { defaultValue: 'Please fix the highlighted fields.' }));
  };

  return {
    control,
    handleSubmit: rhfHandleSubmit(submitForm, onInvalid),
    isSubmitting,
    isLoadingProduct,
    setValue,
    categories,
    existingImages,
    newImages,
    allImages,
    mainImageUrl,
    mainImageFile,
    setMainImageUrl,
    setMainImageFile,
    handleMainImageSelect,
    isEditMode: !!productId,
    productId,
    isDeletingImage,
    unifiedUploaderProps,
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
