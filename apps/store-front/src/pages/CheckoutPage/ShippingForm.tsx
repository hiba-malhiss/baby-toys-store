import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Divider,
  IconColor,
  Select,
  StringInput,
  TextArea,
} from '@baby-toys/ui-kit';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import styles from './checkout-page.module.scss';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper.tsx';
import { useActiveTowns, type DeliveryTown } from '../../api/locationsApi';
import TownSelect from '../../components/shared/TownSelect';

export type ShippingFormValues = {
  country: string;
  firstName: string;
  lastName: string;
  region: string;
  address: string;
  townCode: string; // used for pricing + stored on order
  phone: string;
  secondPhone?: string;
  note?: string;
  saveAddress: boolean;
  couponCode?: string;
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
  onTownChange?: (town: DeliveryTown | null) => void;
  couponValid?: boolean | null;
  stockBlocked?: boolean;
  onAlterCart?: () => void;
};

const COUNTRIES = [{ label: 'Palestine', value: 'palestine' }];

const shippingSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  region: z.string().min(1, 'Village/Region is required'),
  address: z.string().min(1, 'Detailed address is required'),
  townCode: z.string().min(1, 'Town is required'),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, 'Invalid phone number')
    .min(1, 'Phone number is required'),
  secondPhone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  note: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  saveAddress: z.boolean().default(true),
  couponCode: z.string().optional(),
});

const emptyValues: ShippingFormValues = {
  country: '',
  firstName: '',
  lastName: '',
  region: '',
  address: '',
  town: '',
  townCode: '',
  phone: '',
  secondPhone: '',
  note: '',
  saveAddress: true,
  couponCode: '',
};

const ShippingForm: React.FC<ShippingFormProps> = ({
  isAuthenticated,
  addresses,
  onSubmit,
  placing,
  disableSubmit,
  onCouponPreview,
  couponValid,
  stockBlocked,
  onAlterCart,
  onTownChange,
}) => {
  const { t } = useTranslation('common');
  const { data: towns = [], isPending: loadingTowns } = useActiveTowns();

  const formMethods = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
    defaultValues: emptyValues,
  });

  const { control, handleSubmit, reset, setValue, getValues } = formMethods;

  const [usingSavedAddress, setUsingSavedAddress] = useState(false);
  const initializedRef = useRef(false);

  const townCode = useWatch({ control, name: 'townCode' });
  const couponCode = useWatch({ control, name: 'couponCode' });

  // init: prefill from saved address (if any), and also ensure a default townCode
  useEffect(() => {
    if (!isAuthenticated || !addresses?.length) return;
    if (initializedRef.current) return;

    const a = addresses[0];
    const firstTown = towns[0] ?? null;

    reset({
      ...emptyValues,
      country: 'palestine',
      firstName: a.firstName || '',
      lastName: a.lastName || '',
      region: a.region || '',
      address: a.detailedAddress || '',
      townCode: firstTown?.code || '',
      phone: a.phoneNumber || '',
    });

    setUsingSavedAddress(true);
    initializedRef.current = true;
  }, [isAuthenticated, addresses, towns, reset]);

  // if towns loaded and no townCode yet, pick first (guests / no saved address)
  useEffect(() => {
    if (!towns.length) return;
    if (getValues('townCode')) return;

    const first = towns[0];
    setValue('townCode', first.code, { shouldDirty: false, shouldTouch: false });
  }, [towns, getValues, setValue]);

  // keep "town" field and parent state in sync with townCode (single source of truth: townCode)
  useEffect(() => {
    if (!townCode) {
      onTownChange?.(null);
      return;
    }

    onTownChange?.(towns?.find((t) => t.code === townCode));
  }, [townCode, towns, onTownChange]);

  const handleCouponPreview = () => {
    const code = (couponCode || '').trim();
    onCouponPreview?.({ code }); // allow empty string to clear quote/coupon
  };

  const canApplyCoupon = !!String(couponCode || '').trim();
  const couponIcon = !canApplyCoupon ? null : couponValid ? CheckCircle : AlertTriangle;
  const couponIconColor = !canApplyCoupon
    ? undefined
    : couponValid
      ? IconColor.success
      : IconColor.warning;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.checkoutPageForm}>
        {isAuthenticated && usingSavedAddress && (
          <Alert icon={CheckCircle} title={t('checkout.form.alertUsingSaved')}>
            <Button
              appearance="link"
              color="underline"
              size="small"
              onClick={() => {
                reset(emptyValues);
                setUsingSavedAddress(false);
              }}
            >
              {t('checkout.form.useDifferentAddress')}
            </Button>
          </Alert>
        )}

        <FormFieldWrapper
          required
          name="country"
          control={control}
          label={t('checkout.form.country')}
        >
          <Select
            options={COUNTRIES.map((c) => ({
              ...c,
              label: t(`checkout.form.countryOptions.${c.value}`, { defaultValue: c.label }),
            }))}
            placeholder={t('checkout.form.selectCountry')}
          />
        </FormFieldWrapper>

        <div className={styles.checkoutPageFormRow}>
          <FormFieldWrapper
            required
            name="firstName"
            control={control}
            label={t('checkout.form.firstName')}
          >
            <StringInput fullWidth placeholder={t('checkout.form.placeholder.firstName')} />
          </FormFieldWrapper>
          <FormFieldWrapper
            required
            name="lastName"
            control={control}
            label={t('checkout.form.lastName')}
          >
            <StringInput fullWidth placeholder={t('checkout.form.placeholder.lastName')} />
          </FormFieldWrapper>
        </div>

        <div className={styles.checkoutPageFormRow}>
          <FormFieldWrapper
            required
            name="townCode"
            control={control}
            label={t('checkout.form.town')}
          >
            <TownSelect placeholder={t('checkout.form.placeholder.town')} />
          </FormFieldWrapper>

          <FormFieldWrapper
            required
            name="region"
            control={control}
            label={t('checkout.form.region')}
          >
            <StringInput fullWidth placeholder={t('checkout.form.placeholder.region')} />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          required
          name="address"
          control={control}
          label={t('checkout.form.address')}
        >
          <StringInput fullWidth placeholder={t('checkout.form.placeholder.address')} />
        </FormFieldWrapper>

        <FormFieldWrapper required name="phone" control={control} label={t('checkout.form.phone')}>
          <StringInput fullWidth placeholder={t('checkout.form.placeholder.phone')} />
        </FormFieldWrapper>

        <FormFieldWrapper
          name="secondPhone"
          control={control}
          label={t('checkout.form.secondPhone')}
        >
          <StringInput fullWidth placeholder={t('checkout.form.placeholder.secondPhone')} />
        </FormFieldWrapper>

        <FormFieldWrapper name="note" control={control} label={t('checkout.form.note')}>
          <TextArea fullWidth placeholder={t('checkout.form.placeholder.note')} rows={3} />
        </FormFieldWrapper>

        <FormFieldWrapper name="couponCode" control={control} label={t('checkout.form.coupon')}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <StringInput
              fullWidth
              placeholder={t('checkout.form.placeholder.coupon')}
              iconRight={couponIcon}
              iconColor={couponIconColor}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCouponPreview();
                }
              }}
            />
            <Button appearance="outline" onClick={handleCouponPreview} isDisabled={!canApplyCoupon}>
              Apply
            </Button>
            <Button
              size="medium"
              appearance="outline"
              leftIconComp={Trash2}
              onClick={() => {
                setValue('couponCode', '');
                onCouponPreview?.({ code: '' });
              }}
              aria-label="Delete"
              isDisabled={!canApplyCoupon}
            />
          </div>
        </FormFieldWrapper>

        <Divider className="bts-marginVl" />

        {stockBlocked ? (
          <Button fullWidth onClick={onAlterCart} appearance="outline" color="error">
            {t('cart.goToCart')}
          </Button>
        ) : (
          <Button
            type="submit"
            fullWidth
            isLoading={placing}
            isDisabled={!!placing || !!disableSubmit}
          >
            {t('cart.placeOrder')}
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default ShippingForm;
