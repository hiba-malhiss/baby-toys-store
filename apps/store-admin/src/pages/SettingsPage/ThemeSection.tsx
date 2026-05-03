import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColorPicker,
  Select,
  ImageUploader,
  useToast,
  FONT_OPTIONS,
  THEME_PRESET_OPTIONS,
} from '@baby-toys/ui-kit';
import { Control, Controller, useWatch } from 'react-hook-form';
import { useThemeSettings, useUploadLogo, useDeleteLogo } from '../../api/settingsApi';
import styles from './theme-section.module.scss';

interface ThemeSectionProps {
  control: Control<any>;
}

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
    if (themeData?.logoUrl) setLogoImages([themeData.logoUrl]);
  }, [themeData?.logoUrl]);

  const handleLogoChange = async (files: (File | string)[]) => {
    const newFile = files.find((f): f is File => f instanceof File);
    const existingUrl = files.find((f): f is string => typeof f === 'string');
    if (newFile) {
      try {
        if (themeData?.logoUrl) await deleteLogoMutation.mutateAsync(themeData.logoUrl);
        const url = await uploadLogoMutation.mutateAsync(newFile);
        setLogoImages([url]);
        toast.success(t('settings.theme.logoUploaded', { defaultValue: 'Logo uploaded' }));
      } catch {
        toast.error(t('settings.theme.logoUploadError', { defaultValue: 'Failed to upload logo' }));
      }
    } else if (existingUrl) {
      setLogoImages([existingUrl]);
    } else if (themeData?.logoUrl) {
      try {
        await deleteLogoMutation.mutateAsync(themeData.logoUrl);
        setLogoImages([]);
        toast.success(t('settings.theme.logoDeleted', { defaultValue: 'Logo removed' }));
      } catch {
        toast.error(t('settings.theme.logoDeleteError', { defaultValue: 'Failed to remove logo' }));
      }
    }
  };

  const isLogoProcessing = uploadLogoMutation.isPending || deleteLogoMutation.isPending;

  return (
    <div className={styles.section}>
      {/* ── Logo ── */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <span className={styles.label}>
            {t('settings.theme.logo', { defaultValue: 'Store logo' })}
          </span>
          <span className={styles.hint}>
            {t('settings.theme.logoHint', {
              defaultValue: 'PNG with transparent background, max 2 MB.',
            })}
          </span>
        </div>
        <div className={styles.rowControl}>
          <div className={styles.logoUploader}>
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
        </div>
      </div>

      <div className={styles.divider} />

      {/* ── Theme preset ── */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <span className={styles.label}>
            {t('settings.theme.preset', { defaultValue: 'Theme preset' })}
          </span>
          <span className={styles.hint}>
            {t('settings.theme.presetHint', {
              defaultValue:
                'Apply a curated palette and font. Leave blank to use custom settings below.',
            })}
          </span>
        </div>
        <div className={styles.rowControl}>
          <Controller
            name="theme.themeName"
            control={control}
            render={({ field }) => {
              const activeSwatch = THEME_PRESET_OPTIONS.find(
                (o) => o.value === field.value
              )?.swatch;
              return (
                <div className={styles.presetRow}>
                  <Select
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={THEME_PRESET_OPTIONS}
                    fullWidth
                  />
                  {field.value && activeSwatch && (
                    <div
                      className={styles.presetSwatch}
                      // @ts-ignore
                      style={{ '--swatch-color': activeSwatch }}
                    />
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* ── Colors (custom only) ── */}
      {!isPresetSelected && (
        <>
          <div className={styles.divider} />
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <span className={styles.label}>
                {t('settings.theme.colors', { defaultValue: 'Colors' })}
              </span>
              <span className={styles.hint}>
                {t('settings.theme.colorsHint', {
                  defaultValue: 'Used for buttons, badges, and highlights across the storefront.',
                })}
              </span>
            </div>
            <div className={styles.rowControl}>
              <div className={styles.colorsGrid}>
                {[
                  {
                    name: 'theme.primaryColor',
                    label: t('settings.theme.primaryColor', { defaultValue: 'Primary' }),
                    hint: t('settings.theme.primaryColorHint', { defaultValue: 'Buttons & links' }),
                  },
                  {
                    name: 'theme.accentColor',
                    label: t('settings.theme.accentColor', { defaultValue: 'Accent' }),
                    hint: t('settings.theme.accentColorHint', { defaultValue: 'Badges & CTAs' }),
                  },
                  {
                    name: 'theme.secondaryColor',
                    label: t('settings.theme.secondaryColor', { defaultValue: 'Secondary' }),
                    hint: t('settings.theme.secondaryColorHint', {
                      defaultValue: 'Borders & muted',
                    }),
                  },
                ].map(({ name, label, hint }) => (
                  <div key={name} className={styles.colorItem}>
                    <Controller
                      name={name}
                      control={control}
                      render={({ field }) => (
                        <ColorPicker value={field.value || '#1096b5'} onChange={field.onChange} />
                      )}
                    />
                    <span className={styles.colorLabel}>{label}</span>
                    <span className={styles.colorHint}>{hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Font (custom only) ── */}
      {!isPresetSelected && (
        <>
          <div className={styles.divider} />
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <span className={styles.label}>
                {t('settings.theme.fontFamily', { defaultValue: 'Font family' })}
              </span>
              <span className={styles.hint}>
                {t('settings.theme.fontFamilyHint', {
                  defaultValue: 'Applied to all text on the storefront.',
                })}
              </span>
            </div>
            <div className={styles.rowControl}>
              <Controller
                name="theme.fontFamily"
                control={control}
                render={({ field }) => (
                  <div className={styles.fontBlock}>
                    <Select
                      value={field.value || "'Comfortaa', sans-serif"}
                      onChange={field.onChange}
                      options={FONT_OPTIONS}
                      fullWidth
                    />
                    <div
                      className={styles.fontPreview}
                      // @ts-ignore
                      style={{ '--preview-font': field.value || "'Comfortaa', sans-serif" }}
                    >
                      {t('settings.theme.fontPreview', {
                        defaultValue: 'The quick brown fox jumps over the lazy dog — 0123456789',
                      })}
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSection;
