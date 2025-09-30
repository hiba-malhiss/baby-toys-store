import React, { useEffect } from 'react';
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
} from '@baby-toys/ui-kit';
import {
  useStoreSettings,
  useUpsertStoreSettings,
  type StoreSettingUpdateItem,
} from '../../api/settingsApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import moment from 'moment/moment';
import { ADMIN_LOCAL_DATETIME_FORMAT } from '../CouponsPage/coupons-page.utils.ts';
import { SettingsFormValues, settingsSchema } from './settings-page.util.tsx';

const CalendarFieldAdapter: React.FC<{
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  isDisabled?: boolean;
}> = ({ value, onChange, isDisabled }) => (
  <Calendar
    value={value ? moment(value) : undefined}
    onChange={(m) => {
      const next = Array.isArray(m) ? (m[0]?.toDate?.() ?? null) : ((m as any)?.toDate?.() ?? null);
      onChange?.(next);
    }}
    isDisabled={isDisabled}
    disableFutureDates={false}
    selectionMode="single"
    typeView="date"
    appendToBody
    fullWidth
  />
);

const SettingsPage: React.FC = () => {
  const toast = useToast();
  const { data } = useStoreSettings();
  const upsertMutation = useUpsertStoreSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      general: {
        currency: '',
        currencySymbol: '',
        timezone: '',
        priceRangeMin: '',
        priceRangeMax: '',
      },
      contact: {
        workDays: '',
        workTimes: '',
        phone: '',
        email: '',
        address: '',
      },
      policies: {
        cancelPolicy: '',
        returnPolicy: '',
        shippingPolicy: '',
        freeShippingMinSubtotal: undefined,
        freeShippingStartAt: undefined,
        freeShippingEndAt: undefined,
      },
    },
    mode: 'onBlur',
  });

  const { control, handleSubmit, reset, formState, setValue, clearErrors, trigger } = form;

  const handleResetFreeShipping = () => {
    setValue('policies.freeShippingMinSubtotal', null, {
      shouldDirty: true,
      shouldValidate: false,
    });
    setValue('policies.freeShippingStartAt', null, {
      shouldDirty: true,
      shouldValidate: false,
    });
    setValue('policies.freeShippingEndAt', null, {
      shouldDirty: true,
      shouldValidate: false,
    });
    clearErrors([
      'policies.freeShippingMinSubtotal',
      'policies.freeShippingStartAt',
      'policies.freeShippingEndAt',
    ]);
  };

  useEffect(() => {
    if (!data) return;
    reset({
      general: {
        currency: data.general?.currency ?? '',
        currencySymbol: data.general?.currencySymbol ?? '',
        timezone: data.general?.timezone ?? '',
        priceRangeMin: data.general?.priceRangeMin ?? '',
        priceRangeMax: data.general?.priceRangeMax ?? '',
      },
      contact: {
        workDays: data.contact?.workDays ?? '',
        workTimes: data.contact?.workTimes ?? '',
        phone: data.contact?.phone ?? '',
        email: data.contact?.email ?? '',
        address: data.contact?.address ?? '',
      },
      policies: {
        cancelPolicy: data.policies?.cancelPolicy ?? '',
        returnPolicy: data.policies?.returnPolicy ?? '',
        shippingPolicy: data.policies?.shippingPolicy ?? '',
        freeShippingMinSubtotal: data.policies?.freeShippingMinSubtotal ?? undefined,
        freeShippingStartAt: data.policies?.freeShippingStartAt
          ? new Date(data.policies.freeShippingStartAt)
          : undefined,
        freeShippingEndAt: data.policies?.freeShippingEndAt
          ? new Date(data.policies.freeShippingEndAt)
          : undefined,
      },
    });
  }, [data, reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    const payload: StoreSettingUpdateItem[] = [
      // General
      { section: 'GENERAL', key: 'currency', value: values.general.currency },
      { section: 'GENERAL', key: 'currencySymbol', value: values.general.currencySymbol },
      { section: 'GENERAL', key: 'timezone', value: values.general.timezone },
      { section: 'GENERAL', key: 'priceRangeMin', value: values.general.priceRangeMin || '' },
      { section: 'GENERAL', key: 'priceRangeMax', value: values.general.priceRangeMax || '' },
      // Contact
      { section: 'CONTACT', key: 'workDays', value: values.contact.workDays },
      { section: 'CONTACT', key: 'workTimes', value: values.contact.workTimes },
      { section: 'CONTACT', key: 'phone', value: values.contact.phone },
      { section: 'CONTACT', key: 'email', value: values.contact.email },
      { section: 'CONTACT', key: 'address', value: values.contact.address },
      // Policies
      { section: 'POLICIES', key: 'cancelPolicy', value: values.policies.cancelPolicy },
      { section: 'POLICIES', key: 'returnPolicy', value: values.policies.returnPolicy },
      { section: 'POLICIES', key: 'shippingPolicy', value: values.policies.shippingPolicy },
      {
        section: 'POLICIES',
        key: 'freeShippingMinSubtotal',
        value: values.policies.freeShippingMinSubtotal ?? null,
      },
      {
        section: 'POLICIES',
        key: 'freeShippingStartAt',
        value: values.policies.freeShippingStartAt
          ? moment(values.policies.freeShippingStartAt).format(ADMIN_LOCAL_DATETIME_FORMAT)
          : null,
      },
      {
        section: 'POLICIES',
        key: 'freeShippingEndAt',
        value: values.policies.freeShippingEndAt
          ? moment(values.policies.freeShippingEndAt).format(ADMIN_LOCAL_DATETIME_FORMAT)
          : null,
      },
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

            {/* General Section */}
            <Accordion header="General" buttonAppearance="outline">
              <Flex direction="vertical" spacing="m" fullWidth>
                <FormFieldWrapper
                  control={control}
                  name="general.currency"
                  label="Currency"
                  fullWidth
                  required
                >
                  <StringInput placeholder="USD" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="general.currencySymbol"
                  label="Currency Symbol"
                  fullWidth
                  required
                >
                  <StringInput placeholder="$" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="general.timezone"
                  label="Timezone"
                  fullWidth
                  required
                >
                  <StringInput placeholder="Asia/Gaza" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="general.priceRangeMin"
                  label="Price Range Min"
                  fullWidth
                >
                  <StringInput placeholder="0" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="general.priceRangeMax"
                  label="Price Range Max"
                  fullWidth
                >
                  <StringInput placeholder="300" />
                </FormFieldWrapper>
              </Flex>
            </Accordion>

            {/* Contact Section */}
            <Accordion header="Contact" buttonAppearance="outline">
              <Flex direction="vertical" spacing="m" fullWidth>
                <FormFieldWrapper
                  control={control}
                  name="contact.workDays"
                  label="Working Days"
                  fullWidth
                  required
                >
                  <StringInput placeholder="Monday to Friday" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="contact.workTimes"
                  label="Working Times"
                  fullWidth
                  required
                >
                  <StringInput placeholder="10am - 6pm (Palestine time)" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="contact.phone"
                  label="Phone"
                  fullWidth
                  required
                >
                  <StringInput placeholder="+1 234 567 8900" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="contact.email"
                  label="Email"
                  fullWidth
                  required
                >
                  <StringInput placeholder="support@toystore.com" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="contact.address"
                  label="Address"
                  fullWidth
                  required
                >
                  <TextArea rows={3} placeholder="123 Toy Lane, Playtown, USA" />
                </FormFieldWrapper>
              </Flex>
            </Accordion>

            {/* Policies Section */}
            <Accordion header="Policies" buttonAppearance="outline">
              <Flex direction="vertical" spacing="m" fullWidth>
                <FormFieldWrapper
                  control={control}
                  name="policies.cancelPolicy"
                  label="Cancel Policy"
                  fullWidth
                >
                  <TextArea rows={4} placeholder="Describe cancellation policy" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="policies.returnPolicy"
                  label="Return Policy"
                  fullWidth
                >
                  <TextArea rows={4} placeholder="Describe return policy" />
                </FormFieldWrapper>
                <FormFieldWrapper
                  control={control}
                  name="policies.shippingPolicy"
                  label="Shipping Policy"
                  fullWidth
                >
                  <TextArea rows={4} placeholder="Describe shipping policy" />
                </FormFieldWrapper>
              </Flex>
            </Accordion>

            {/* Free Shipping Section */}
            <Accordion header="Free Shipping" buttonAppearance="outline">
              <Flex spacing="m" fullWidth direction="vertical">
                <Text color="muted" size="sm">
                  Note: Free shipping applies when order subtotal ≥ threshold and now is within the
                  configured period and threshold is greater than 0.
                </Text>
                <Flex align="end" spacing="m" fullWidth>
                  <FormFieldWrapper
                    control={control}
                    name="policies.freeShippingMinSubtotal"
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
                    name="policies.freeShippingStartAt"
                    label="Starts At"
                    fullWidth
                  >
                    <CalendarFieldAdapter />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    control={control}
                    name="policies.freeShippingEndAt"
                    label="Ends At"
                    fullWidth
                  >
                    <CalendarFieldAdapter />
                  </FormFieldWrapper>
                </Flex>
              </Flex>
            </Accordion>

            <Flex justify="end">
              <Button
                type="submit"
                isLoading={upsertMutation.isPending}
                isDisabled={formState.isSubmitting}
              >
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
