import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Card,
  Flex,
  Heading,
  Button,
  useToast,
  StringInput,
  TextArea,
  Accordion,
  Calendar,
  Text,
  TabBar,
  TabBarItem,
} from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import {
  useAdminStoreSettingsMap,
  useUpsertStoreSettings,
  type StoreSettingUpdateItem,
} from '../../api/settingsApi';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { settingsSchema, SettingsFormValues } from './settings-page.util';
import { getSupportedLocales } from '../../i18n/locale.ts';
import moment from 'moment';
import { ADMIN_LOCAL_DATETIME_FORMAT } from '../CouponsPage/coupons-page.utils.ts';

const emptyGeneral = {
  currency: '',
  currencySymbol: '',
  timezone: '',
  priceRangeMin: '',
  priceRangeMax: '',
  dailyOrdersGoal: '',
  monthlyRevenueGoal: '',
};

const emptyContact = {
  workDays: '',
  workTimes: '',
  phone: '',
  email: '',
  address: '',
};

const emptyPolicies = {
  cancelPolicy: '',
  returnPolicy: '',
  shippingPolicy: '',
};

const emptyPoliciesGlobal = {
  freeShippingMinSubtotal: null,
  freeShippingStartAt: null,
  freeShippingEndAt: null,
};

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

const SettingsPage: React.FC = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const { data: settingsMap } = useAdminStoreSettingsMap();
  const upsertMutation = useUpsertStoreSettings();

  const locales = useMemo(() => getSupportedLocales(), []);

  const defaultValues = useMemo(
    () => ({
      general: { ...emptyGeneral },
      contact: Object.fromEntries(locales.map((locale) => [locale, { ...emptyContact }])),
      policies: Object.fromEntries(locales.map((locale) => [locale, { ...emptyPolicies }])),
      policiesGlobal: { ...emptyPoliciesGlobal },
    }),
    [locales]
  );

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema(locales)),
    defaultValues,
  });

  const { control, handleSubmit, reset, setValue, clearErrors } = form;
  const [activeContactTab, setActiveContactTab] = useState(locales[0]);
  const [activePoliciesTab, setActivePoliciesTab] = useState(locales[0]);

  useEffect(() => {
    if (!settingsMap) return;
    const localeKeys = Object.keys(settingsMap);
    const base = localeKeys.length > 0 ? settingsMap[localeKeys[0]] : undefined;

    reset({
      general: base?.general ?? emptyGeneral,
      contact: Object.fromEntries(locales.map((l) => [l, settingsMap[l]?.contact ?? emptyContact])),
      policies: Object.fromEntries(
        locales.map((l) => [l, settingsMap[l]?.policies ?? emptyPolicies])
      ),
      policiesGlobal: base?.policies ?? emptyPoliciesGlobal,
    });
  }, [settingsMap, reset, locales]);

  const handleResetFreeShipping = () => {
    setValue('policiesGlobal.freeShippingMinSubtotal', null, { shouldDirty: true });
    setValue('policiesGlobal.freeShippingStartAt', null, { shouldDirty: true });
    setValue('policiesGlobal.freeShippingEndAt', null, { shouldDirty: true });
    clearErrors('policiesGlobal');
  };

  const onSubmit = async (values: SettingsFormValues) => {
    const payload: StoreSettingUpdateItem[] = [
      ...Object.entries(values.general).map(([key, value]) => ({
        section: 'GENERAL',
        key,
        value,
      })),
      ...locales.flatMap((locale) =>
        Object.entries(values.contact[locale]).map(([key, value]) => ({
          section: 'CONTACT',
          key,
          value,
          locale,
        }))
      ),
      ...locales.flatMap((locale) =>
        Object.entries(values.policies[locale]).map(([key, value]) => ({
          section: 'POLICIES',
          key,
          value,
          locale,
        }))
      ),
      ...Object.entries(values.policiesGlobal).map(([key, value]) => ({
        section: 'POLICIES',
        key,
        value:
          value instanceof Date
            ? moment(value).format(ADMIN_LOCAL_DATETIME_FORMAT)
            : (value ?? null),
      })),
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card fullWidth>
          <Flex direction="column" spacing="xxl" fullWidth>
            <Heading>{t('settings.title')}</Heading>

            {/* General */}
            <Accordion header={t('settings.sections.general')} buttonAppearance="outline">
              <Flex direction="vertical" spacing="m" fullWidth>
                {[
                  'currency',
                  'currencySymbol',
                  'timezone',
                  'priceRangeMin',
                  'priceRangeMax',
                  'dailyOrdersGoal',
                  'monthlyRevenueGoal',
                ].map((field) => (
                  <FormFieldWrapper
                    key={field}
                    control={control}
                    name={`general.${field}`}
                    label={t(`settings.fields.${field}`)}
                    required
                    fullWidth
                  >
                    <StringInput
                      placeholder={field}
                      type={
                        field.includes('price') || field.toLowerCase().includes('goal')
                          ? 'number'
                          : 'text'
                      }
                    />
                  </FormFieldWrapper>
                ))}
              </Flex>
            </Accordion>

            {/* Contact */}
            <Accordion header={t('settings.sections.contact')} buttonAppearance="outline">
              <TabBar
                fullWidth
                size="small"
                value={activeContactTab}
                onChange={setActiveContactTab}
                tabs={locales.map((l) => ({ header: l.toUpperCase(), value: l }))}
              >
                {locales.map((l) => (
                  <TabBarItem key={l} value={l}>
                    <Flex direction="vertical" spacing="m" fullWidth>
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
                    </Flex>
                  </TabBarItem>
                ))}
              </TabBar>
            </Accordion>

            {/* Policies */}
            <Accordion header={t('settings.sections.policies')} buttonAppearance="outline">
              <TabBar
                fullWidth
                size="small"
                value={activePoliciesTab}
                onChange={setActivePoliciesTab}
                tabs={locales.map((l) => ({ header: l.toUpperCase(), value: l }))}
              >
                {locales.map((l) => (
                  <TabBarItem key={l} value={l}>
                    <Flex direction="vertical" spacing="m" fullWidth>
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
                    </Flex>
                  </TabBarItem>
                ))}
              </TabBar>
            </Accordion>

            {/* Free Shipping */}
            <Accordion header={t('settings.sections.freeShipping')} buttonAppearance="outline">
              <Flex spacing="m" fullWidth direction="vertical">
                <Text color="muted" size="sm">
                  {t('settings.freeShipping.description')}
                </Text>

                <Flex align="end" spacing="m" fullWidth>
                  <FormFieldWrapper
                    control={control}
                    name="policiesGlobal.freeShippingMinSubtotal"
                    label={t('settings.fields.freeShippingMinSubtotal')}
                    fullWidth
                  >
                    <StringInput placeholder="50.00" type="number" />
                  </FormFieldWrapper>
                  <Button type="button" appearance="outline" onClick={handleResetFreeShipping}>
                    {t('settings.freeShipping.clearButton')}
                  </Button>
                </Flex>

                <Flex fullWidth spacing="m">
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
                </Flex>
              </Flex>
            </Accordion>

            <Flex justify="end">
              <Button type="submit" isLoading={upsertMutation.isPending}>
                {t('settings.actions.saveSettings')}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </form>
    </AdminLayout>
  );
};

export default SettingsPage;
