import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColorPicker,
  Select,
  ImageUploader,
  useToast,
  Divider,
  FONT_OPTIONS,
  THEME_PRESET_OPTIONS,
} from '@baby-toys/ui-kit';
import { Control, Controller, useWatch } from 'react-hook-form';
import { useThemeSettings, useUploadLogo, useDeleteLogo } from '../../api/settingsApi';
import styles from './theme-section.module.scss';

interface ThemeSectionProps {
  control: Control<any>;
}

interface ColorFieldProps {
  name: string;
  label: string;
  hint: string;
  control: Control<any>;
}

const ColorField: React.FC<ColorFieldProps> = ({ name, label, hint, control }) => (
  <div className={styles.colorItem}>
    <span className={styles.fieldLabel}>{label}</span>
    <span className={styles.fieldHint}>{hint}</span>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ColorPicker value={field.value || '#1096b5'} onChange={field.onChange} />
      )}
    />
  </div>
);

const ThemeSection: React.FC<ThemeSectionProps> = ({ control }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: themeData } = useThemeSettings();
  const uploadLogoMutation = useUploadLogo();
  const deleteLogoMutation = useDeleteLogo();
  const [logoImages, setLogoImages] = useState<(string | File)[]>([]);

  const themeName = useWatch({ control, name: 'theme.themeName' });
  const isPresetSelected = Boolean(themeName);

  useEffect(() => {
    if (themeData?.logoUrl) {
      setLogoImages([themeData.logoUrl]);
    }
  }, [themeData?.logoUrl]);

  const handleLogoChange = async (files: (File | string)[]) => {
    const newFile = files.find((f): f is File => f instanceof File);
    const existingUrl = files.find((f): f is string => typeof f === 'string');

    if (newFile) {
      try {
        // Delete old logo if replacing
        if (themeData?.logoUrl) {
          await deleteLogoMutation.mutateAsync(themeData.logoUrl);
        }
        const url = await uploadLogoMutation.mutateAsync(newFile);
        setLogoImages([url]);
        toast.success(
          t('settings.theme.logoUploaded', { defaultValue: 'Logo uploaded successfully' })
        );
      } catch {
        toast.error(t('settings.theme.logoUploadError', { defaultValue: 'Failed to upload logo' }));
      }
    } else if (existingUrl) {
      setLogoImages([existingUrl]);
    } else {
      // Logo removed
      if (themeData?.logoUrl) {
        try {
          await deleteLogoMutation.mutateAsync(themeData.logoUrl);
          setLogoImages([]);
          toast.success(t('settings.theme.logoDeleted', { defaultValue: 'Logo removed' }));
        } catch {
          toast.error(
            t('settings.theme.logoDeleteError', { defaultValue: 'Failed to remove logo' })
          );
        }
      }
    }
  };

  const isLogoProcessing = uploadLogoMutation.isPending || deleteLogoMutation.isPending;

  return (
    <div className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.title}>
          {t('settings.theme.title', { defaultValue: 'Theme & Branding' })}
        </p>
        <p className={styles.description}>
          {t('settings.theme.description', {
            defaultValue:
              'Customize your store colors, font, and logo. Changes apply immediately to the storefront.',
          })}
        </p>
      </div>

      {/* Logo */}
      <div className={styles.logoBlock}>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>
            {t('settings.theme.logo', { defaultValue: 'Store logo' })}
          </span>
          <span className={styles.fieldHint}>
            {t('settings.theme.logoHint', {
              defaultValue:
                'Displayed in the header, footer, and admin sidebar. Recommended: PNG with transparent background.',
            })}
          </span>
        </div>
        <ImageUploader
          images={logoImages}
          multiple={false}
          maxImages={1}
          maxFileSizeMB={2}
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          onImagesChange={handleLogoChange}
          isDisabled={isLogoProcessing}
        />
      </div>

      <Divider />

      {/* Theme preset */}
      <div className={styles.presetBlock}>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>
            {t('settings.theme.preset', { defaultValue: 'Theme preset' })}
          </span>
          <span className={styles.fieldHint}>
            {t('settings.theme.presetHint', {
              defaultValue: 'Choose a preset to instantly apply a curated color palette and font.',
            })}
          </span>
        </div>
        <Controller
          name="theme.themeName"
          control={control}
          render={({ field }) => {
            const activeSwatch = THEME_PRESET_OPTIONS.find(
              (opt) => opt.value === field.value
            )?.swatch;
            return (
              <div className={styles.presetRow}>
                <div className={styles.presetSelect}>
                  <Select
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={THEME_PRESET_OPTIONS}
                    fullWidth
                  />
                </div>
                {field.value && activeSwatch && (
                  // CSS custom property drives the swatch color — no inline style object
                  <div
                    className={styles.presetSwatch}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore — CSS custom properties on React elements
                    style={{ '--swatch-color': activeSwatch }}
                    aria-label={`Color swatch for selected preset`}
                  />
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Color pickers — custom theme only */}
      {!isPresetSelected && (
        <div className={styles.colorsRow}>
          <ColorField
            name="theme.primaryColor"
            control={control}
            label={t('settings.theme.primaryColor', { defaultValue: 'Primary color' })}
            hint={t('settings.theme.primaryColorHint', {
              defaultValue: 'Buttons, links, highlights',
            })}
          />
          <ColorField
            name="theme.accentColor"
            control={control}
            label={t('settings.theme.accentColor', { defaultValue: 'Accent color' })}
            hint={t('settings.theme.accentColorHint', {
              defaultValue: 'Sale badges, alerts, CTA elements',
            })}
          />
          <ColorField
            name="theme.secondaryColor"
            control={control}
            label={t('settings.theme.secondaryColor', { defaultValue: 'Secondary color' })}
            hint={t('settings.theme.secondaryColorHint', {
              defaultValue: 'Borders, muted text, backgrounds',
            })}
          />
        </div>
      )}

      {/* Font selector — custom theme only */}
      {!isPresetSelected && (
        <div className={styles.fontBlock}>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>
              {t('settings.theme.fontFamily', { defaultValue: 'Font family' })}
            </span>
            <span className={styles.fieldHint}>
              {t('settings.theme.fontFamilyHint', {
                defaultValue: 'Applied to all text across the storefront.',
              })}
            </span>
          </div>
          <Controller
            name="theme.fontFamily"
            control={control}
            render={({ field }) => (
              <>
                <Select
                  value={field.value || "'Comfortaa', sans-serif"}
                  onChange={field.onChange}
                  options={FONT_OPTIONS}
                  fullWidth
                />
                {/* Live preview — font injected via CSS custom property */}
                <div
                  className={styles.fontPreview}
                  style={{ '--preview-font': field.value || "'Comfortaa', sans-serif" }}
                >
                  {t('settings.theme.fontPreview', {
                    defaultValue: 'The quick brown fox jumps over the lazy dog — 0123456789',
                  })}
                </div>
              </>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ThemeSection;
