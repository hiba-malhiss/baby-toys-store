import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  Text,
  ColorPicker,
  Select,
  ImageUploader,
  useToast,
  Divider,
} from '@baby-toys/ui-kit';
import { Control, Controller } from 'react-hook-form';
import { useThemeSettings, useUploadLogo, useDeleteLogo } from '../../api/settingsApi';

interface ThemeSectionProps {
  control: Control<any>;
}

export const FONT_OPTIONS = [
  { label: 'Comfortaa (Default – Playful)', value: "'Comfortaa', sans-serif" },
  { label: 'Poppins (Modern & Clean)', value: "'Poppins', sans-serif" },
  { label: 'Montserrat (Bold & Strong)', value: "'Montserrat', sans-serif" },
  { label: 'Inter (Professional & Minimal)', value: "'Inter', sans-serif" },
  { label: 'Playfair Display (Elegant & Serif)', value: "'Playfair Display', serif" },
  { label: 'Lato (Friendly & Readable)', value: "'Lato', sans-serif" },
];

const ColorField: React.FC<{
  name: string;
  label: string;
  hint: string;
  control: Control<any>;
}> = ({ name, label, hint, control }) => (
  <Flex direction="vertical" spacing="s">
    <Text size="sm" weight="medium">
      {label}
    </Text>
    <Text size="xs" color="muted">
      {hint}
    </Text>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ColorPicker value={field.value || '#1096b5'} onChange={field.onChange} />
      )}
    />
  </Flex>
);

const ThemeSection: React.FC<ThemeSectionProps> = ({ control }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: themeData } = useThemeSettings();
  const uploadLogoMutation = useUploadLogo();
  const deleteLogoMutation = useDeleteLogo();
  const [logoImages, setLogoImages] = useState<(string | File)[]>([]);

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
    <Flex direction="vertical" spacing="xl" fullWidth>
      <Text color="muted" size="sm">
        {t('settings.theme.description', {
          defaultValue:
            'Customize your store colors, font, and logo. Changes apply immediately to the storefront.',
        })}
      </Text>

      {/* Logo uploader */}
      <Flex direction="vertical" spacing="s" style={{ maxWidth: 360 }}>
        <Text size="sm" weight="medium">
          {t('settings.theme.logo', { defaultValue: 'Store Logo' })}
        </Text>
        <Text size="xs" color="muted">
          {t('settings.theme.logoHint', {
            defaultValue:
              'Displayed in the header, footer, and admin sidebar. Recommended: PNG with transparent background.',
          })}
        </Text>
        <ImageUploader
          images={logoImages}
          multiple={false}
          maxImages={1}
          maxFileSizeMB={2}
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          onImagesChange={handleLogoChange}
          isDisabled={isLogoProcessing}
        />
      </Flex>

      <Divider />

      {/* Color pickers row */}
      <Flex spacing="xxl" fullWidth>
        <ColorField
          name="theme.primaryColor"
          control={control}
          label={t('settings.theme.primaryColor', { defaultValue: 'Primary Color' })}
          hint={t('settings.theme.primaryColorHint', {
            defaultValue: 'Buttons, links, highlights',
          })}
        />
        <ColorField
          name="theme.accentColor"
          control={control}
          label={t('settings.theme.accentColor', { defaultValue: 'Accent Color' })}
          hint={t('settings.theme.accentColorHint', {
            defaultValue: 'Sale badges, alerts, CTA elements',
          })}
        />
        <ColorField
          name="theme.secondaryColor"
          control={control}
          label={t('settings.theme.secondaryColor', { defaultValue: 'Secondary Color' })}
          hint={t('settings.theme.secondaryColorHint', {
            defaultValue: 'Borders, muted text, backgrounds',
          })}
        />
      </Flex>

      {/* Font selector */}
      <Flex direction="vertical" spacing="s" style={{ maxWidth: 360 }}>
        <Text size="sm" weight="medium">
          {t('settings.theme.fontFamily', { defaultValue: 'Font Family' })}
        </Text>
        <Text size="xs" color="muted">
          {t('settings.theme.fontFamilyHint', {
            defaultValue: 'Applied to all text across the storefront',
          })}
        </Text>
        <Controller
          name="theme.fontFamily"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || "'Comfortaa', sans-serif"}
              onChange={field.onChange}
              options={FONT_OPTIONS}
              fullWidth
            />
          )}
        />
        {/* Live font preview */}
        <Controller
          name="theme.fontFamily"
          control={control}
          render={({ field }) => (
            <div
              style={{
                fontFamily: field.value || "'Comfortaa', sans-serif",
                padding: '12px 16px',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-text-primary)',
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {t('settings.theme.fontPreview', {
                defaultValue: 'The quick brown fox jumps over the lazy dog — 0123456789',
              })}
            </div>
          )}
        />
      </Flex>
    </Flex>
  );
};

export default ThemeSection;
