import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Card,
  Heading,
  Button,
  useToast,
  StringInput,
  TextArea,
  Calendar,
  Text,
  TabBar,
  TabBarItem,
  Select,
  Toggle,
  Divider,
  Accordion,
  applyThemeSettings,
  Flex,
} from '@baby-toys/ui-kit';
import { useForm, Controller } from 'react-hook-form';
import {
  useAdminStoreSettingsMap,
  useUpsertStoreSettings,
  useThemeSettings,
  type StoreSettingUpdateItem,
} from '../../api/settingsApi';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { settingsSchema, SettingsFormValues } from './settings-page.util';
import { useLocales } from '../../hooks/useLocales';
import moment from 'moment';
import { ADMIN_LOCAL_DATETIME_FORMAT } from '../CouponsPage/coupons-page.utils.ts';
import ThemeSection from './ThemeSection';
import { Settings, Phone, FileText, Truck, Palette } from 'lucide-react';
import styles from './settings-page.module.scss';

const emptyGeneral = {
  currency: '',
  currencySymbol: '',
  timezone: '',
  priceRangeMin: '',
  priceRangeMax: '',
  dailyOrdersGoal: '',
  monthlyRevenueGoal: '',
};
const emptyContact = { workDays: '', workTimes: '', phone: '', email: '', address: '' };
const emptyPolicies = { cancelPolicy: '', returnPolicy: '', shippingPolicy: '' };
const emptyPoliciesGlobal = {
  freeShippingMinSubtotal: null,
  freeShippingStartAt: null,
  freeShippingEndAt: null,
};
const emptyTheme = {
  primaryColor: '#1096b5',
  accentColor: '#f26c62',
  secondaryColor: '#7f7f7f',
  fontFamily: "'Comfortaa', sans-serif",
  translationEnabled: true,
  themeName: '',
};

const TIMEZONE_OPTIONS = [
  { label: 'Asia/Jerusalem (UTC+02:00/UTC+03:00)', value: 'Asia/Jerusalem' },
  { label: 'UTC', value: 'UTC' },
  { label: 'Europe/London (UTC±00:00/UTC+01:00)', value: 'Europe/London' },
  { label: 'Europe/Berlin (UTC+01:00/UTC+02:00)', value: 'Europe/Berlin' },
  { label: 'America/New_York (UTC-05:00/UTC-04:00)', value: 'America/New_York' },
  { label: 'Asia/Dubai (UTC+04:00)', value: 'Asia/Dubai' },
];

const CalendarFieldAdapter = ({ value, onChange, isDisabled }: any) => (
  <Calendar
    value={value ? moment(value) : undefined}
    onChange={(m) =>
      onChange?.(Array.isArray(m) ? (m[0]?.toDate?.() ?? null) : (m?.toDate?.() ?? null))
    }
    isDisabled={isDisabled}
    disableFutureDates={false}
    selectionMode="single"
    typeView="date"
    appendToBody
    fullWidth
  />
);

const contactFields = ['workDays', 'workTimes', 'phone', 'email', 'address'] as const;
const policyFields = ['cancelPolicy', 'returnPolicy', 'shippingPolicy'] as const;

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; hint: string }> = ({
  icon,
  title,
  hint,
}) => (
  <div className={styles.sectionHeader}>
    <div className={styles.sectionIcon}>{icon}</div>
    <div className={styles.sectionText}>
      <span className={styles.sectionTitle}>{title}</span>
      <span className={styles.sectionHint}>{hint}</span>
    </div>
  </div>
);

const SettingsPage: React.FC = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const { data: settingsMap } = useAdminStoreSettingsMap();
  const { data: themeData } = useThemeSettings();
  const upsertMutation = useUpsertStoreSettings();
  const locales = useLocales();

  const defaultValues = useMemo(
    () => ({
      general: { ...emptyGeneral },
      contact: Object.fromEntries(locales.map((l) => [l, { ...emptyContact }])),
      policies: Object.fromEntries(locales.map((l) => [l, { ...emptyPolicies }])),
      policiesGlobal: { ...emptyPoliciesGlobal },
      theme: { ...emptyTheme },
    }),
    [locales]
  );

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema(locales)),
    defaultValues,
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const { control, handleSubmit, reset, setValue, clearErrors, watch } = form;
  const [activeContactTab, setActiveContactTab] = useState(locales[0]);
  const [activePoliciesTab, setActivePoliciesTab] = useState(locales[0]);

  useEffect(() => {
    if (!settingsMap && !themeData) return;
    const localeKeys = settingsMap ? Object.keys(settingsMap) : [];
    const base = localeKeys.length > 0 ? settingsMap[localeKeys[0]] : undefined;
    reset({
      general: base?.general ?? emptyGeneral,
      contact: Object.fromEntries(
        locales.map((l) => [l, settingsMap?.[l]?.contact ?? emptyContact])
      ),
      policies: Object.fromEntries(
        locales.map((l) => [l, settingsMap?.[l]?.policies ?? emptyPolicies])
      ),
      policiesGlobal: base?.policies ?? emptyPoliciesGlobal,
      theme: {
        primaryColor: themeData?.primaryColor ?? emptyTheme.primaryColor,
        accentColor: themeData?.accentColor ?? emptyTheme.accentColor,
        secondaryColor: themeData?.secondaryColor ?? emptyTheme.secondaryColor,
        fontFamily: themeData?.fontFamily ?? emptyTheme.fontFamily,
        translationEnabled: themeData?.translationEnabled ?? emptyTheme.translationEnabled,
        themeName: themeData?.themeName ?? '',
      },
    });
  }, [settingsMap, themeData]);

  const watchedTheme = watch('theme');
  useEffect(() => {
    if (watchedTheme)
      applyThemeSettings({
        primaryColor: watchedTheme.primaryColor,
        accentColor: watchedTheme.accentColor,
        secondaryColor: watchedTheme.secondaryColor,
        fontFamily: watchedTheme.fontFamily,
        themeName: watchedTheme.themeName,
      });
  }, [watchedTheme]);

  const handleResetFreeShipping = () => {
    setValue('policiesGlobal.freeShippingMinSubtotal', null, { shouldDirty: true });
    setValue('policiesGlobal.freeShippingStartAt', null, { shouldDirty: true });
    setValue('policiesGlobal.freeShippingEndAt', null, { shouldDirty: true });
    clearErrors('policiesGlobal');
  };

  const onSubmit = async (values: SettingsFormValues) => {
    const payload: StoreSettingUpdateItem[] = [
      ...Object.entries(values.general).map(([key, value]) => ({
        section: 'GENERAL' as const,
        key,
        value: String(value ?? ''),
      })),
      ...locales.flatMap((locale) =>
        Object.entries(values.contact[locale]).map(([key, value]) => ({
          section: 'CONTACT' as const,
          key,
          value: String(value ?? ''),
          locale,
        }))
      ),
      ...locales.flatMap((locale) =>
        Object.entries(values.policies[locale]).map(([key, value]) => ({
          section: 'POLICIES' as const,
          key,
          value: String(value ?? ''),
          locale,
        }))
      ),
      ...Object.entries(values.policiesGlobal).map(([key, value]) => ({
        section: 'POLICIES' as const,
        key,
        value:
          value instanceof Date
            ? moment(value).format(ADMIN_LOCAL_DATETIME_FORMAT)
            : String(value ?? ''),
      })),
      ...(values.theme.themeName
        ? [{ section: 'THEME' as const, key: 'themeName', value: values.theme.themeName }]
        : [
            {
              section: 'THEME' as const,
              key: 'primaryColor',
              value: values.theme.primaryColor ?? '',
            },
            {
              section: 'THEME' as const,
              key: 'accentColor',
              value: values.theme.accentColor ?? '',
            },
            {
              section: 'THEME' as const,
              key: 'secondaryColor',
              value: values.theme.secondaryColor ?? '',
            },
            { section: 'THEME' as const, key: 'fontFamily', value: values.theme.fontFamily ?? '' },
          ]),
      {
        section: 'THEME' as const,
        key: 'translationEnabled',
        value: String(values.theme.translationEnabled ?? true),
      },
    ];
    try {
      await upsertMutation.mutateAsync(payload);
      toast.success(t('settings.actions.success'));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('settings.actions.error'));
    }
  };

  return (
    <AdminLayout>
      <form
        onSubmit={handleSubmit(onSubmit, () =>
          toast.error(t('app.formInvalid', { defaultValue: 'Please fix the highlighted fields.' }))
        )}
      >
        <div className={styles.pageLayout}>
          <Heading>{t('settings.title')}</Heading>

          {/* General */}
          <Card size="small">
            <Accordion
              buttonColor="light"
              buttonAppearance="link"
              withoutHeaderPadding
              defaultOpen
              header={
                <SectionHeader
                  icon={<Settings size={20} />}
                  title={t('settings.sections.general')}
                  hint={t('settings.sections.generalHint', {
                    defaultValue: 'Currency, timezone, and business goals',
                  })}
                />
              }
            >
              <div className={styles.accordionBody}>
                <div className={styles.fieldsGrid}>
                  {(
                    [
                      'currency',
                      'currencySymbol',
                      'timezone',
                      'priceRangeMin',
                      'priceRangeMax',
                      'dailyOrdersGoal',
                      'monthlyRevenueGoal',
                    ] as const
                  ).map((field) => (
                    <FormFieldWrapper
                      key={field}
                      control={control}
                      name={`general.${field}`}
                      label={t(`settings.fields.${field}`)}
                      required
                      fullWidth
                    >
                      {field === 'timezone' ? (
                        <Select
                          options={TIMEZONE_OPTIONS}
                          placeholder={t('settings.timezone.placeholder', {
                            defaultValue: 'Select timezone',
                          })}
                        />
                      ) : (
                        <StringInput
                          placeholder={field}
                          type={
                            field.includes('price') || field.toLowerCase().includes('goal')
                              ? 'number'
                              : 'text'
                          }
                        />
                      )}
                    </FormFieldWrapper>
                  ))}
                </div>
              </div>
            </Accordion>
          </Card>

          {/* Contact */}
          <Card size="small">
            <Accordion
              buttonColor="light"
              buttonAppearance="link"
              withoutHeaderPadding
              header={
                <SectionHeader
                  icon={<Phone size={20} />}
                  title={t('settings.sections.contact')}
                  hint={t('settings.sections.contactHint', {
                    defaultValue: 'Store contact details per language',
                  })}
                />
              }
            >
              <div className={styles.accordionBody}>
                <TabBar
                  fullWidth
                  size="small"
                  value={activeContactTab}
                  onChange={setActiveContactTab}
                  tabs={locales.map((l) => ({ header: l.toUpperCase(), value: l }))}
                >
                  {locales.map((l) => (
                    <TabBarItem key={l} value={l}>
                      <div className={styles.fieldsGrid}>
                        {contactFields.map((key) => (
                          <FormFieldWrapper
                            key={`${l}-${key}`}
                            control={control}
                            name={`contact.${l}.${key}`}
                            label={`${t(`settings.fields.${key}`)} (${l.toUpperCase()})`}
                            required
                            fullWidth
                          >
                            {key === 'address' ? <TextArea rows={3} /> : <StringInput />}
                          </FormFieldWrapper>
                        ))}
                      </div>
                    </TabBarItem>
                  ))}
                </TabBar>
              </div>
            </Accordion>
          </Card>

          {/* Policies */}
          <Card size="small">
            <Accordion
              buttonColor="light"
              buttonAppearance="link"
              withoutHeaderPadding
              header={
                <SectionHeader
                  icon={<FileText size={20} />}
                  title={t('settings.sections.policies')}
                  hint={t('settings.sections.policiesHint', {
                    defaultValue: 'Cancellation, return, and shipping policies per language',
                  })}
                />
              }
            >
              <div className={styles.accordionBody}>
                <TabBar
                  fullWidth
                  size="small"
                  value={activePoliciesTab}
                  onChange={setActivePoliciesTab}
                  tabs={locales.map((l) => ({ header: l.toUpperCase(), value: l }))}
                >
                  {locales.map((l) => (
                    <TabBarItem key={l} value={l}>
                      <div className={styles.fieldsStack}>
                        {policyFields.map((key) => (
                          <FormFieldWrapper
                            key={`${l}-${key}`}
                            control={control}
                            name={`policies.${l}.${key}`}
                            label={`${t(`settings.fields.${key}`)} (${l.toUpperCase()})`}
                            required
                            fullWidth
                          >
                            <TextArea rows={4} />
                          </FormFieldWrapper>
                        ))}
                      </div>
                    </TabBarItem>
                  ))}
                </TabBar>
              </div>
            </Accordion>
          </Card>

          {/* Free Shipping */}
          <Card size="small">
            <Accordion
              buttonColor="light"
              buttonAppearance="link"
              withoutHeaderPadding
              header={
                <SectionHeader
                  icon={<Truck size={20} />}
                  title={t('settings.sections.freeShipping')}
                  hint={t('settings.freeShipping.description')}
                />
              }
            >
              <div className={styles.accordionBody}>
                <div className={styles.freeShippingGrid}>
                  <div className={styles.freeShippingRow}>
                    <FormFieldWrapper
                      control={control}
                      name="policiesGlobal.freeShippingMinSubtotal"
                      label={t('settings.fields.freeShippingMinSubtotal')}
                      fullWidth
                    >
                      <StringInput placeholder="50.00" type="number" />
                    </FormFieldWrapper>
                    <div className={styles.clearButtonWrapper}>
                      <Button type="button" appearance="outline" onClick={handleResetFreeShipping}>
                        {t('settings.freeShipping.clearButton')}
                      </Button>
                    </div>
                  </div>
                  <div className={styles.dateRow}>
                    <FormFieldWrapper
                      control={control}
                      name="policiesGlobal.freeShippingStartAt"
                      label={t('settings.fields.freeShippingStartAt')}
                      fullWidth
                    >
                      <CalendarFieldAdapter />
                    </FormFieldWrapper>
                    <FormFieldWrapper
                      control={control}
                      name="policiesGlobal.freeShippingEndAt"
                      label={t('settings.fields.freeShippingEndAt')}
                      fullWidth
                    >
                      <CalendarFieldAdapter />
                    </FormFieldWrapper>
                  </div>
                </div>
              </div>
            </Accordion>
          </Card>

          {/* Theme */}
          <Card size="small">
            <Accordion
              buttonColor="light"
              buttonAppearance="link"
              withoutHeaderPadding
              header={
                <SectionHeader
                  icon={<Palette size={20} />}
                  title={t('settings.sections.theme', { defaultValue: 'Theme & Branding' })}
                  hint={t('settings.sections.themeHint', {
                    defaultValue: 'Colors, fonts, and language settings',
                  })}
                />
              }
            >
              <div className={styles.accordionBody}>
                <ThemeSection control={control} />
                <Divider />
                <div className={styles.toggleRow}>
                  <div>
                    <Text size="sm" weight="medium">
                      {t('settings.theme.translationEnabled', {
                        defaultValue: 'Enable Multi-language (AR + EN)',
                      })}
                    </Text>
                    <Text size="xs" color="muted">
                      {t('settings.theme.translationEnabledHint', {
                        defaultValue: 'When off, only Arabic content fields are shown.',
                      })}
                    </Text>
                  </div>
                  <Controller
                    name="theme.translationEnabled"
                    control={control}
                    render={({ field }) => (
                      <Toggle value={!!field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
              </div>
            </Accordion>
          </Card>

          {/* Fixed save */}
          <Flex justify="end" fullWidth>
            <Button type="submit" color="primary" isLoading={upsertMutation.isPending}>
              {t('homepage.actions.saveChanges')}
            </Button>
          </Flex>
        </div>
      </form>
    </AdminLayout>
  );
};

export default SettingsPage;
