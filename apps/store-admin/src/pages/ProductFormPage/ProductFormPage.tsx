import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Option,
  ImageUploader,
  ImagePickerModal,
  Text,
  BouncingDotsLoader,
  LocaleBadge,
} from '@baby-toys/ui-kit';

import { Layers, CheckCircle } from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import LocalizedFields from './LocalizedFields';

import { useProductForm } from './useProductForm';
import { useAttributeTypes } from '../../api/attributeApi';

import styles from './Productsform.module.scss';
import AttributesSection from './components/AttributesSection.tsx';
import OptionsSection from './components/OptionsSection.tsx';

type TabId = 'general' | 'media' | 'catalog';

const TABS: { id: TabId; label: string; defaultLabel: string }[] = [
  { id: 'general', label: 'productForm.tab.general', defaultLabel: 'General' },
  { id: 'media', label: 'productForm.tab.media', defaultLabel: 'Media' },
  { id: 'catalog', label: 'productForm.tab.catalog', defaultLabel: 'Catalog & Variants' },
];

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: attributeTypes = [] } = useAttributeTypes();
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const {
    control,
    handleSubmit,
    isSubmitting,
    submitPhase,
    submitPhaseLabel,
    isLoadingProduct,
    categories,
    isEditMode,
    productId,
    unifiedUploaderProps,
    allImages,
    mainImageUrl,
    handleMainImageSelect,
    isDeletingImage,
    setValue,
  } = useProductForm();

  if (isLoadingProduct) {
    return (
      <AdminLayout>
        <Flex justify="center" align="center" className="bts-marginTxxxl">
          <BouncingDotsLoader />
        </Flex>
      </AdminLayout>
    );
  }

  // Derive the save button label from the current submit phase
  const saveLabel = (() => {
    if (submitPhaseLabel) return submitPhaseLabel;
    return isEditMode
      ? t('productForm.saveChanges', { defaultValue: 'Save Changes' })
      : t('productForm.createProduct', { defaultValue: 'Create Product' });
  })();

  const isFormDisabled = isSubmitting || isDeletingImage;

  return (
    <AdminLayout isMaskLoading={isSubmitting}>
      <form onSubmit={handleSubmit}>
        <div className={styles.pageLayout}>
          {/* Page header */}
          <div className={styles.pageHeader}>
            <div>
              <Heading>
                {isEditMode ? t('productForm.editTitle') : t('productForm.addTitle')}
              </Heading>
              {isEditMode && productId && (
                <p className={styles.pageHeaderSub}>
                  {t('productForm.productId', { defaultValue: 'Product ID' })}: #{productId}
                </p>
              )}
            </div>
            <div className={styles.pageHeaderActions}>
              {isEditMode && productId && (
                <Button
                  type="button"
                  appearance="outline"
                  leftIconComp={Layers}
                  isDisabled={isFormDisabled}
                  onClick={() => navigate(`/edit-product/${productId}/variations`)}
                >
                  {t('productForm.manageVariations', { defaultValue: 'Manage Variations' })}
                </Button>
              )}
            </div>
          </div>

          {/* Tab nav */}
          <div className={styles.tabNav}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
                disabled={isFormDisabled}
              >
                {t(tab.label, tab.defaultLabel)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={styles.tabContent}>
            {activeTab === 'general' && (
              <div className={styles.productsFormGeneral}>
                <Card fullWidth>
                  <Flex direction="vertical" spacing="m" fullWidth>
                    <div className={styles.localeSectionHeader}>
                      <LocaleBadge locale="ar" size="medium" />
                      <span className={styles.localeLabel}>
                        {t('productForm.arabicContent', 'Arabic Content')}
                      </span>
                    </div>
                    <LocalizedFields
                      control={control}
                      locale={'ar' as any}
                      isDisabled={isFormDisabled}
                    />
                  </Flex>
                </Card>

                <Card fullWidth>
                  <Flex direction="vertical" spacing="m" fullWidth>
                    <div className={styles.localeSectionHeader}>
                      <LocaleBadge locale="en" size="medium" />
                      <span className={styles.localeLabel}>
                        {t('productForm.englishContent', 'English Content')}
                      </span>
                    </div>
                    <LocalizedFields
                      control={control}
                      locale={'en' as any}
                      isDisabled={isFormDisabled}
                    />
                  </Flex>
                </Card>
              </div>
            )}

            {activeTab === 'media' && (
              <Card fullWidth>
                <Flex direction="vertical" spacing="xxl" fullWidth>
                  <FormFieldWrapper
                    label={t('productForm.galleryImages', { defaultValue: 'Product Images' })}
                    fullWidth
                  >
                    <ImageUploader {...unifiedUploaderProps} fullHeight maxImages={10} />
                  </FormFieldWrapper>

                  <ImagePickerModal
                    images={allImages}
                    value={mainImageUrl}
                    onChange={handleMainImageSelect}
                    label={t('productForm.mainImage', { defaultValue: 'Main Image' })}
                    placeholder={t('productForm.selectMainImage', {
                      defaultValue: 'Select Main Image',
                    })}
                    title={t('productForm.selectMainImage', { defaultValue: 'Select Main Image' })}
                    disabled={isFormDisabled}
                    status="default"
                  />

                  {!mainImageUrl && allImages.length > 0 && (
                    <Text size="sm" color="warning">
                      {t('productForm.mainImageHint', {
                        defaultValue:
                          '⚠ No main image selected. Pick one above — it will be shown in product listings.',
                      })}
                    </Text>
                  )}
                </Flex>
              </Card>
            )}

            {activeTab === 'catalog' && (
              <Flex direction="vertical" spacing="l" fullWidth>
                {/* Category */}
                <Card fullWidth>
                  <div className={styles.catalogSectionTitle}>
                    {t('productForm.category', 'Category')}
                  </div>
                  <FormFieldWrapper
                    name="categoryId"
                    control={control}
                    label={t('productForm.category')}
                    fullWidth
                  >
                    <Select fullWidth isDisabled={isFormDisabled}>
                      {categories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Option>
                      ))}
                    </Select>
                  </FormFieldWrapper>
                </Card>

                {/* Attributes */}
                <Card fullWidth>
                  <AttributesSection
                    control={control}
                    attributeTypes={attributeTypes}
                    isDisabled={isFormDisabled}
                    setValue={setValue}
                  />
                </Card>

                {/* Options */}
                <Card fullWidth>
                  <OptionsSection
                    control={control}
                    isDisabled={isFormDisabled}
                    setValue={setValue}
                  />

                  {isEditMode && productId && (
                    <div className={styles.variantsCta}>
                      <div className={styles.variantsCtaText}>
                        <span className={styles.variantsCtaTitle}>
                          {t('productForm.afterSavingOptions', {
                            defaultValue: 'After saving, manage your variants',
                          })}
                        </span>
                        <span className={styles.variantsCtaSub}>
                          {t('productForm.variantsCtaSub', {
                            defaultValue:
                              'Each option combination becomes a variant with its own price, stock, and image.',
                          })}
                        </span>
                      </div>
                      <Button
                        type="button"
                        appearance="outline"
                        leftIconComp={Layers}
                        isDisabled={isFormDisabled}
                        onClick={() => navigate(`/edit-product/${productId}/variations`)}
                      >
                        {t('productForm.manageVariations', { defaultValue: 'Manage Variations' })}
                      </Button>
                    </div>
                  )}
                </Card>
              </Flex>
            )}
          </div>

          {/* Bottom save */}
          <div className={styles.formFooter}>
            <Button
              type="submit"
              isDisabled={isFormDisabled}
              isLoading={isSubmitting}
              leftIconComp={submitPhase === 'done' ? CheckCircle : undefined}
            >
              {saveLabel}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ProductFormPage;
