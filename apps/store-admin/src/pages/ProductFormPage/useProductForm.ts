import { useState, useEffect, useRef } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';

type ProductFormValues = z.infer<typeof productSchema>;

/**
 * Upload progress phases — lets the UI show what's happening while the
 * page stays locked during a multi-step save.
 */
export type SubmitPhase =
  | 'idle'
  | 'saving' // product create/update API call
  | 'uploading' // gallery image uploads
  | 'uploading-main' // main image upload
  | 'done'; // brief "done" state before navigation

export const useProductForm = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const blobUrlMap = useRef<Map<File, string>>(new Map());

  const getBlobUrl = (file: File): string => {
    if (!blobUrlMap.current.has(file)) {
      blobUrlMap.current.set(file, URL.createObjectURL(file));
    }
    return blobUrlMap.current.get(file)!;
  };

  /**
   * submitPhase tracks the exact step during multi-step save so the UI can
   * show precise progress and keep the submit button disabled + loading
   * until navigation happens.
   */
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

  const isSaving = submitPhase !== 'idle';

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

  // Live watchers for char counters
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
      const images = product.images || [];
      const mainImg = product.mainImage || null;
      const deduped = mainImg && !images.includes(mainImg) ? [mainImg, ...images] : images;

      setExistingImages(deduped);
      setMainImageUrl(mainImg);
      setMainImageFile(null);

      const trMap = new Map<string, any>();
      (product as any).translations?.forEach((t: any) => {
        if (t?.locale) trMap.set(String(t.locale).toLowerCase(), t);
      });
      const enTr = trMap.get('en') || {};
      const arTr = trMap.get('ar') || {};

      const toDetailsArray = (details: any) =>
        details
          ? Object.entries(details as Record<string, string>).map(([label, value]) => ({
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

      reset({
        ...defaultProductValues,
        options: optionsArray,
        attributes: attributesArray,
        releaseDate: product.releaseDate || '',
        images: deduped,
        mainImage: mainImg || '',
        isActive: product.isActive ?? true,
        categoryId: product.categoryId ?? undefined,
        translations: {
          en: {
            name: enTr.name || '',
            shortDescription: enTr.shortDescription || '',
            description: enTr.description || '',
            featureBullets:
              Array.isArray(enTr.featureBullets) && enTr.featureBullets.length
                ? enTr.featureBullets
                : [''],
            details: toDetailsArray(enTr.details),
          },
          ar: {
            name: arTr.name || '',
            shortDescription: arTr.shortDescription || '',
            description: arTr.description || '',
            featureBullets:
              Array.isArray(arTr.featureBullets) && arTr.featureBullets.length
                ? arTr.featureBullets
                : [''],
            details: toDetailsArray(arTr.details),
          },
        },
      } as unknown as ProductFormValues);

      setNewImages([]);
      setMainImageFile(null);
      // Clear stale blob URL mappings when re-loading a product
      blobUrlMap.current.clear();
    } else {
      reset(defaultProductValues);
      setExistingImages([]);
      setNewImages([]);
      setMainImageUrl(null);
      setMainImageFile(null);
      blobUrlMap.current.clear();
    }
  }, [product, reset]);

  // Combined image pool for ImagePickerModal
  const allImages: (File | string)[] = [...existingImages, ...newImages];

  // ─────────────────────────────────────────────────────────────────────────────
  // Core submit — stays on page until ALL API calls finish, then navigates
  // ─────────────────────────────────────────────────────────────────────────────
  const submitForm = async (data: ProductFormValues) => {
    try {
      if (!mainImageUrl && !mainImageFile) {
        toast.error(
          t('productForm.errors.mainImageRequired', {
            defaultValue: 'Please select a main image before saving.',
          })
        );
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

      const attributes = (data as any).attributes
        ? (data as any).attributes
            .filter((a: any) => a && a.attributeTypeId)
            .map((a: any) => ({
              attributeTypeId: Number(a.attributeTypeId),
              valueIds: Array.isArray(a.valueIds) ? a.valueIds.map((v: any) => Number(v)) : [],
            }))
        : [];

      const payload = {
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

      // ── Step 1: Save product ──────────────────────────────────────────────
      setSubmitPhase('saving');

      const savedId = productId
        ? await updateProduct.mutateAsync({ id: productId, ...payload })
        : await createProduct.mutateAsync(payload);

      const resolvedId = productId || savedId;

      // ── Step 2: Upload gallery images (sequentially to avoid overload) ────
      const galleryFiles = newImages.filter((f) => f !== mainImageFile);

      if (galleryFiles.length > 0) {
        setSubmitPhase('uploading');
        setUploadProgress({ done: 0, total: galleryFiles.length });

        for (let i = 0; i < galleryFiles.length; i++) {
          await uploadProductImage(resolvedId, galleryFiles[i]);
          setUploadProgress({ done: i + 1, total: galleryFiles.length });
        }
      }

      // ── Step 3: Upload main image if it's a new file ──────────────────────
      if (mainImageFile) {
        setSubmitPhase('uploading-main');
        await uploadMainImage(resolvedId, mainImageFile);
      }

      // ── Step 4: All done — show success then navigate ─────────────────────
      setSubmitPhase('done');
      toast.success(
        t(productId ? 'productForm.updatedSuccess' : 'productForm.createdSuccess', {
          defaultValue: `Product ${productId ? 'updated' : 'created'} successfully`,
        })
      );

      // Small delay so toast is visible before navigation
      setTimeout(() => {
        navigate('/products');
      }, 400);
    } catch (err: any) {
      setSubmitPhase('idle');
      setUploadProgress({ done: 0, total: 0 });
      const backendMsg = err?.response?.data?.message || err?.message || 'Failed to save product';
      toast.error(backendMsg);
    }
  };

  const handleMainImageSelect = (urlOrBlob: string) => {
    setMainImageUrl(urlOrBlob);
    if (urlOrBlob.startsWith('blob:')) {
      const matchedFile = newImages.find((f) => getBlobUrl(f) === urlOrBlob);
      setMainImageFile(matchedFile || null);
    } else {
      setMainImageFile(null);
    }
  };

  const unifiedUploaderProps = {
    images: allImages,
    multiple: true,
    maxImages: MAX.images,
    onBackendDelete: async (url: string) => {
      if (!productId) return;
      if (mainImageUrl === url) {
        toast.error(
          t('productForm.errors.cannotDeleteMainImage', {
            defaultValue:
              'This is the main image. Choose a different main image first, then delete this one.',
          })
        );
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

      if (mainImageUrl) {
        if (mainImageUrl.startsWith('blob:')) {
          // Find the File that owns this blob URL
          const ownerFile = [...blobUrlMap.current.entries()].find(
            ([, blobUrl]) => blobUrl === mainImageUrl
          )?.[0];
          // If that file is no longer in the new list, clear the selection
          if (ownerFile && !filesArr.includes(ownerFile)) {
            setMainImageUrl(null);
            setMainImageFile(null);
          }
        } else {
          if (!urls.includes(mainImageUrl)) {
            setMainImageUrl(null);
            setMainImageFile(null);
          }
        }
      }

      // Revoke blob URLs for files that were removed to avoid memory leaks
      blobUrlMap.current.forEach((blobUrl, file) => {
        if (!filesArr.includes(file)) {
          URL.revokeObjectURL(blobUrl);
          blobUrlMap.current.delete(file);
        }
      });
    },
    isDisabled: isDeletingImage || isSaving,
  };

  const onInvalid = () => {
    toast.error(t('app.formInvalid', { defaultValue: 'Please fix the highlighted fields.' }));
  };

  // Human-readable label for the loading state shown in the submit button
  const submitPhaseLabel = (() => {
    if (submitPhase === 'saving')
      return t('productForm.phases.saving', { defaultValue: 'Saving product…' });
    if (submitPhase === 'uploading')
      return t('productForm.phases.uploading', {
        defaultValue: `Uploading images (${uploadProgress.done}/${uploadProgress.total})…`,
        done: uploadProgress.done,
        total: uploadProgress.total,
      });
    if (submitPhase === 'uploading-main')
      return t('productForm.phases.uploadingMain', { defaultValue: 'Uploading main image…' });
    if (submitPhase === 'done') return t('productForm.phases.done', { defaultValue: 'Done!' });
    return null;
  })();

  return {
    control,
    handleSubmit: rhfHandleSubmit(submitForm, onInvalid),
    isSubmitting: isSubmitting || isSaving,
    submitPhase,
    submitPhaseLabel,
    uploadProgress,
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
