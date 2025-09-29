import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Divider, IconColor, Select, StringInput } from '@baby-toys/ui-kit';
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

export type ShippingFormValues = {
  country: string;
  firstName: string;
  lastName: string;
  region: string;
  address: string;
  town: string;
  phone: string;
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
  phone: z.string().min(1, 'Phone number is required'),
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
          <Alert icon={faCheck} title="Using your saved shipping information">
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
                  saveAddress: true,
                  couponCode: '',
                  shippingOptionId: null,
                });
                setUsingSavedAddress(false);
              }}
            >
              Use different shipping address
            </Button>
          </Alert>
        )}

        {/* Country */}
        <FormFieldWrapper name="country" control={control} label="Country">
          <Select options={COUNTRIES} placeholder="Select country" />
        </FormFieldWrapper>

        {/* First + Last name */}
        <div className={styles.checkoutPageFormRow}>
          <FormFieldWrapper name="firstName" control={control} label="First Name">
            <StringInput fullWidth />
          </FormFieldWrapper>
          <FormFieldWrapper name="lastName" control={control} label="Last Name">
            <StringInput fullWidth />
          </FormFieldWrapper>
        </div>

        {/* Town + Region */}
        <div className={styles.checkoutPageFormRow}>
          <FormFieldWrapper name="town" control={control} label="Town">
            <StringInput fullWidth />
          </FormFieldWrapper>
          <FormFieldWrapper name="region" control={control} label="Village or Region">
            <StringInput fullWidth />
          </FormFieldWrapper>
        </div>

        {/* Address */}
        <FormFieldWrapper name="address" control={control} label="Detailed Address">
          <StringInput fullWidth />
        </FormFieldWrapper>

        {/* Phone */}
        <FormFieldWrapper name="phone" control={control} label="Phone Number">
          <StringInput fullWidth />
        </FormFieldWrapper>

        {/* Shipping option */}
        <FormFieldWrapper name="shippingOptionId" control={control} label="Shipping Method">
          <Select
            options={shippingSelectOptions}
            isLoading={loadingShipping}
            placeholder="Select shipping option"
          />
        </FormFieldWrapper>

        {/* Coupon */}
        <FormFieldWrapper name="couponCode" control={control} label="Coupon Code (optional)">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <StringInput
              fullWidth
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
        <Button
          type="submit"
          fullWidth
          isLoading={placing}
          isDisabled={placing || disableSubmit || !formState.isValid}
        >
          Place Order
        </Button>
      </form>
    </FormProvider>
  );
};

export default ShippingForm;
