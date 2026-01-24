import React, { useEffect, useMemo, useState } from 'react';
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
import { getSupportedLocales } from '../../components/i18n/locale';
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
  const { data: settingsMap } = useAdminStoreSettingsMap();
  const upsertMutation = useUpsertStoreSettings();

  const locales = useMemo(() => getSupportedLocales(), []);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema(locales)),
    defaultValues: {
      general: emptyGeneral,
      contact: Object.fromEntries(
        locales.map((l) => [l, emptyContact])
      ) as any,
      policies: Object.fromEntries(
        locales.map((l) => [l, emptyPolicies])
      ) as any,
      policiesGlobal: emptyPoliciesGlobal,
    },
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
      policies: Object.fromEntries(locales.map((l) => [l, settingsMap[l]?.policies ?? emptyPolicies])),
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
      toast.success('Store settings updated');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update settings');
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card fullWidth>
          <Flex direction="column" spacing="xxl" fullWidth>
            <Heading>Store Settings</Heading>

            {/* General */}
            <Accordion header="General" buttonAppearance="outline">
              {[
                'currency',
                'currencySymbol',
                'timezone',
                'priceRangeMin',
                'priceRangeMax',
                'dailyOrdersGoal',
                'monthlyRevenueGoal',
              ].map(
                (field) => (
                  <FormFieldWrapper
                    key={field}
                    control={control}
                    name={`general.${field}`}
                    label={field.replace(/([A-Z])/g, ' $1')}
                    required
                    fullWidth
                  >
                    <StringInput
                      placeholder={field}
                      type={field.includes('price') || field.toLowerCase().includes('goal') ? 'number' : 'text'}
                    />
                  </FormFieldWrapper>
                )
              )}
            </Accordion>

            {/* Contact */}
            <Accordion header="Contact" buttonAppearance="outline">
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
                          key={key}
                          control={control}
                          name={`contact.${l}.${key}`}
                          label={`${key} (${l})`}
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
            <Accordion header="Policies" buttonAppearance="outline">
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
                          key={key}
                          control={control}
                          name={`policies.${l}.${key}`}
                          label={`${key} (${l})`}
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
            <Accordion header="Free Shipping" buttonAppearance="outline">
              <Flex spacing="m" fullWidth direction="vertical">
                <Text color="muted" size="sm">
                  Free shipping applies when subtotal ≥ threshold and within the configured dates.
                </Text>

                <Flex align="end" spacing="m" fullWidth>
                  <FormFieldWrapper
                    control={control}
                    name="policiesGlobal.freeShippingMinSubtotal"
                    label="Minimum Subtotal"
                    fullWidth
                  >
                    <StringInput placeholder="50.00" type="number" />
                  </FormFieldWrapper>
                  <Button type="button" appearance="outline" onClick={handleResetFreeShipping}>
                    Clear
                  </Button>
                </Flex>

                <Flex fullWidth spacing="m">
                  <FormFieldWrapper
                    control={control}
                    name="policiesGlobal.freeShippingStartAt"
                    label="Starts At"
                    fullWidth
                  >
                    <CalendarFieldAdapter />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    control={control}
                    name="policiesGlobal.freeShippingEndAt"
                    label="Ends At"
                    fullWidth
                  >
                    <CalendarFieldAdapter />
                  </FormFieldWrapper>
                </Flex>
              </Flex>
            </Accordion>

            <Flex justify="end">
              <Button type="submit" isLoading={upsertMutation.isPending}>
                Save Settings
              </Button>
            </Flex>
          </Flex>
        </Card>
      </form>
    </AdminLayout>
  );
};

export default SettingsPage;
