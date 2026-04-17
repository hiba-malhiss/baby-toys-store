import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, ColorPicker, Select, Divider } from '@baby-toys/ui-kit';
import { Control, Controller } from 'react-hook-form';

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
}> = ({ name, label, hint, control }) => {
  return (
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
};

const ThemeSection: React.FC<ThemeSectionProps> = ({ control }) => {
  const { t } = useTranslation();

  return (
    <Flex direction="vertical" spacing="xl" fullWidth>
      <Text color="muted" size="sm">
        {t('settings.theme.description', {
          defaultValue:
            'Customize your store colors and font. Changes apply immediately to the storefront.',
        })}
      </Text>

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
      <Divider thickness="2px" />
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
        <Flex spacing="m" align="center">
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
          <Controller
            name="theme.fontFamily"
            control={control}
            render={({ field }) => (
              <div style={{ fontFamily: field.value || "'Comfortaa', sans-serif" }}>
                {t('settings.theme.fontPreview', {
                  defaultValue: 'The quick brown fox jumps over the lazy dog — 0123456789',
                })}
              </div>
            )}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ThemeSection;
