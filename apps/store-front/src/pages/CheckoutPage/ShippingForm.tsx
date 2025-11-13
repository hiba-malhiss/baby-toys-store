import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Divider, IconColor, Select, StringInput, TextArea } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import {
  faCheck,
  faTrashAlt,
  faTriangleExclamation,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { type ShippingOption, useActiveShippingOptions } from '../../api/shippingOptionsApi';
import { useStoreSettings } from '../../api/settingsApi';
import styles from './checkout-page.module.scss';
import { useTranslation } from 'react-i18next';

export type ShippingFormValues = {
  country: string;
  firstName: string;
  lastName: string;
  region: string;
  address: string;
  town: string;
  phone: string;
  secondPhone?: string;
  note?: string;
  saveAddress: boolean;
  couponCode?: string;
  shippingOptionId?: number | null;
};

type Address = {
  firstName?: string;
  lastName?: string;
  region?: string;
  detailedAddress?: string;
  town?: string;
  phoneNumber?: string;
};

type ShippingFormProps = {
  isAuthenticated: boolean;
  addresses?: Address[];
  onSubmit: (values: ShippingFormValues) => void | Promise<void>;
  placing?: boolean;
  disableSubmit?: boolean;
  onCouponPreview?: (info: { code: string }) => void;
  onShippingOptionChange?: (opt: ShippingOption | null) => void;
  couponValid?: boolean | null;
};

// Allowed countries
const COUNTRIES = [{ label: 'Palestine', value: 'palestine' }];

// Validation schema
const shippingSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  region: z.string().min(1, 'Village/Region is required'),
  address: z.string().min(1, 'Detailed address is required'),
  town: z.string().min(1, 'Town is required'),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, 'Invalid phone number')
    .min(1, 'Phone number is required'),
  secondPhone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  note: z.string().max(1000).optional().or(z.literal('').transform(() => undefined)),
  saveAddress: z.boolean().default(true),
  couponCode: z.string().optional(),
  shippingOptionId: z.string().optional(),
});

const ShippingForm: React.FC<ShippingFormProps> = ({
  isAuthenticated,
  addresses,
  onSubmit,
  placing,
  disableSubmit,
  onCouponPreview,
  onShippingOptionChange,
  couponValid,
}) => {
  const formMethods = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
    defaultValues: {
      country: '',
      firstName: '',
      lastName: '',
      region: '',
      address: '',
      town: '',
      phone: '',
      secondPhone: '',
      note: '',
      saveAddress: true,
      couponCode: '',
      shippingOptionId: null,
    },
  });

  const { control, formState, handleSubmit, reset, getValues, setValue, watch } = formMethods;

  const [usingSavedAddress, setUsingSavedAddress] = useState(false);
  const initializedRef = useRef(false);

  // Shipping options
  const { data: shippingOptions = [], isPending: loadingShipping } = useActiveShippingOptions();
  const { data: settings } = useStoreSettings();
  const symbol = settings?.general?.currencySymbol || '';
  const { t } = useTranslation('common');

  const shippingSelectOptions = useMemo(
    () =>
      (shippingOptions || []).map((o) => ({
        label: `${o.name} (${symbol}${Number(o.cost).toFixed(2)})`,
        value: String(o.id),
      })),
    [shippingOptions, symbol]
  );

  useEffect(() => {
    if (!isAuthenticated || !addresses?.length) return;
    if (initializedRef.current) return;
    const a = addresses[0];
    const firstOpt = shippingOptions[0] ?? null;
    reset({
      country: 'palestine',
      firstName: a.firstName || '',
      lastName: a.lastName || '',
      region: a.region || '',
      address: a.detailedAddress || '',
      town: a.town || '',
      phone: a.phoneNumber || '',
      secondPhone: '',
      note: '',
      saveAddress: true,
      couponCode: '',
      shippingOptionId: firstOpt ? String(firstOpt.id) : null,
    });
    setUsingSavedAddress(true);
    initializedRef.current = true;
  }, [isAuthenticated, addresses, shippingOptions, reset]);

  // Ensure default shipping option
  useEffect(() => {
    // After options load, ensure a default is set once.
    const current = getValues('shippingOptionId');
    const first = shippingOptions[0];
    if (!first || current) return;
    setValue('shippingOptionId', String(first.id), { shouldDirty: false, shouldTouch: false });
  }, [shippingOptions, getValues, setValue]);

  // Notify parent when shipping option changes
  const lastNotifiedShipId = useRef<number | null>(null);
  const selectedShipId = watch('shippingOptionId');
  useEffect(() => {
    const idNum = selectedShipId != null ? Number(selectedShipId) : null;
    if (!idNum) return;
    if (lastNotifiedShipId.current === idNum) return;
    const found = shippingOptions?.find((o) => o.id === idNum) || null;
    if (!found) return;
    onShippingOptionChange?.(found);
    lastNotifiedShipId.current = idNum;
  }, [selectedShipId, shippingOptions, onShippingOptionChange]);

  // Coupon preview
  const handleCouponPreview = () => {
    const code = (getValues('couponCode') || '').trim();
    if (code) onCouponPreview?.({ code });
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.checkoutPageForm}>
        {/* Alert for saved address */}
        {isAuthenticated && usingSavedAddress && (
          <Alert icon={faCheck} title={t('checkout.form.alertUsingSaved')}>
            <Button
              appearance="link"
              color="primary"
              withoutPadding
              size="small"
              onClick={() => {
                reset({
                  country: '',
                  firstName: '',
                  lastName: '',
                  region: '',
                  address: '',
                  town: '',
                  phone: '',
                  secondPhone: '',
                  note: '',
                  saveAddress: true,
                  couponCode: '',
                  shippingOptionId: null,
                });
                setUsingSavedAddress(false);
              }}
            >
              {t('checkout.form.useDifferentAddress')}
            </Button>
          </Alert>
        )}

        {/* Country */}
        <FormFieldWrapper required name="country" control={control} label={t('checkout.form.country')}>
          <Select
            options={COUNTRIES.map((c) => ({ ...c, label: t(`checkout.form.countryOptions.${c.value}`, { defaultValue: c.label }) }))}
            placeholder={t('checkout.form.selectCountry')}
          />
        </FormFieldWrapper>

        {/* First + Last name */}
        <div className={styles.checkoutPageFormRow}>
          <FormFieldWrapper required name="firstName" control={control} label={t('checkout.form.firstName')}>
            <StringInput fullWidth placeholder={t('checkout.form.placeholder.firstName')} />
          </FormFieldWrapper>
          <FormFieldWrapper required name="lastName" control={control} label={t('checkout.form.lastName')}>
            <StringInput fullWidth placeholder={t('checkout.form.placeholder.lastName')} />
          </FormFieldWrapper>
        </div>

        {/* Town + Region */}
        <div className={styles.checkoutPageFormRow}>
          <FormFieldWrapper required name="town" control={control} label={t('checkout.form.town')}>
            <StringInput fullWidth placeholder={t('checkout.form.placeholder.town')} />
          </FormFieldWrapper>
          <FormFieldWrapper required name="region" control={control} label={t('checkout.form.region')}>
            <StringInput fullWidth placeholder={t('checkout.form.placeholder.region')} />
          </FormFieldWrapper>
        </div>

        {/* Address */}
        <FormFieldWrapper required name="address" control={control} label={t('checkout.form.address')}>
          <StringInput fullWidth placeholder={t('checkout.form.placeholder.address')} />
        </FormFieldWrapper>

        {/* Phone */}
        <FormFieldWrapper required name="phone" control={control} label={t('checkout.form.phone')}>
          <StringInput fullWidth placeholder={t('checkout.form.placeholder.phone')} />
        </FormFieldWrapper>

        {/* Second Phone (optional) */}
        <FormFieldWrapper name="secondPhone" control={control} label={t('checkout.form.secondPhone')}>
          <StringInput fullWidth placeholder={t('checkout.form.placeholder.secondPhone')} />
        </FormFieldWrapper>

        {/* Note (optional) */}
        <FormFieldWrapper name="note" control={control} label={t('checkout.form.note')}>
          <TextArea fullWidth placeholder={t('checkout.form.placeholder.note')} rows={3} />
        </FormFieldWrapper>

        {/* Shipping option */}
        <FormFieldWrapper
          required
          name="shippingOptionId"
          control={control}
          label={t('checkout.form.shippingMethod')}
        >
          <Select
            options={shippingSelectOptions}
            isLoading={loadingShipping}
            placeholder={t('checkout.form.selectShipping')}
          />
        </FormFieldWrapper>

        {/* Coupon */}
        <FormFieldWrapper name="couponCode" control={control} label={t('checkout.form.coupon')}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <StringInput
              fullWidth
              placeholder={t('checkout.form.placeholder.coupon')}
              iconRight={
                !watch('couponCode') ? null : couponValid ? faCheckCircle : faTriangleExclamation
              }
              iconColor={couponValid ? IconColor.success : IconColor.warning}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCouponPreview();
                }
              }}
            />
            <Button
              appearance="outline"
              onClick={handleCouponPreview}
              isDisabled={!String(watch('couponCode') || '').trim()}
            >
              Apply
            </Button>
            <Button
              size="medium"
              appearance="outline"
              leftIcon={faTrashAlt}
              onClick={() => {
                setValue('couponCode', '');
                onCouponPreview?.({ code: '' });
              }}
              aria-label="Delete"
              isDisabled={!String(watch('couponCode') || '').trim()}
            />
          </div>
        </FormFieldWrapper>
        <Divider className="bts-marginVl" />
        {/* Submit */}
        <Button type="submit" fullWidth isLoading={placing} isDisabled={placing || disableSubmit}>
          Place Order
        </Button>
      </form>
    </FormProvider>
  );
};

export default ShippingForm;
