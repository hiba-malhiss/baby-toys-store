import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Button, FieldWrapper, Select, StringInput, Alert } from '@baby-toys/ui-kit';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useValidateCoupon } from '../../api/orderApi';
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
};

type Address = {
  firstName?: string;
  lastName?: string;
  region?: string;
  detailedAddress?: string;
  town?: string;
  phoneNumber?: string;
};

const COUNTRIES = [{ label: 'Palestine', value: 'palestine' }];

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
});

type ShippingFormProps = {
  isAuthenticated: boolean;
  addresses?: Address[];
  onSubmit: (values: ShippingFormValues) => void | Promise<void>;
  placing?: boolean;
  disableSubmit?: boolean;
  onCouponPreview?: (info: {
    code: string;
    applied: boolean;
    discount: number;
    previewTotal: number | null;
    message: string;
  }) => void;
};

export const ShippingForm: React.FC<ShippingFormProps> = ({
  isAuthenticated,
  addresses,
  onSubmit,
  placing,
  disableSubmit,
  onCouponPreview,
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
    },
  });

  const { control, formState, handleSubmit, reset, getValues, setValue, watch } = formMethods;
  const errors = formState.errors as any;
  const [isLoadedFromCloud, setIsLoadedFromCloud] = useState(false);
  const validateCoupon = useValidateCoupon();
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) return;
    if (addresses && addresses.length > 0) {
      const a = addresses[0];
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
      });
      setIsLoadedFromCloud(true);
    }
  }, [isAuthenticated, addresses, reset]);

  const validateAndPreview = async () => {
    const code = (getValues('couponCode') || '').trim();
    if (!code) {
      setCouponApplied(false);
      setCouponMessage('');
      onCouponPreview?.({ code: '', applied: false, discount: 0, previewTotal: null, message: '' });
      return;
    }
    try {
      const res = await validateCoupon.mutateAsync({ code });
      if (res?.valid) {
        const discount = Number(res.discountAmount) || 0;
        const respSubtotal = Number(res.subtotal) || 0;
        setCouponApplied(true);
        const message = res.message || 'Coupon applied';
        setCouponMessage(message);
        onCouponPreview?.({
          code,
          applied: true,
          discount,
          previewTotal: respSubtotal - discount,
          message,
        });
      } else {
        setCouponApplied(false);
        const message = res?.message || 'Coupon invalid';
        setCouponMessage(message);
        onCouponPreview?.({ code, applied: false, discount: 0, previewTotal: null, message });
      }
    } catch (e) {
      setCouponApplied(false);
      setCouponMessage('');
      onCouponPreview?.({ code, applied: false, discount: 0, previewTotal: null, message: '' });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.checkoutPageForm}>
        {isAuthenticated && isLoadedFromCloud && (
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
                });
                setIsLoadedFromCloud(false);
              }}
            >
              Use different shipping address
            </Button>
          </Alert>
        )}
        <FieldWrapper label="Country" error={errors?.country?.message as string}>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Select
                options={COUNTRIES}
                hasError={!!errors?.country}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select country"
              />
            )}
          />
        </FieldWrapper>

        <div className={styles.checkoutPageFormRow}>
          <FieldWrapper label="First Name" error={errors?.firstName?.message as string}>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <StringInput
                  fullWidth
                  hasError={!!errors?.firstName}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldWrapper>
          <FieldWrapper label="Last Name" error={errors?.lastName?.message as string}>
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <StringInput
                  fullWidth
                  hasError={!!errors?.lastName}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldWrapper>
        </div>

        <div className={styles.checkoutPageFormRow}>
          <FieldWrapper label="Town" error={errors?.town?.message as string}>
            <Controller
              control={control}
              name="town"
              render={({ field }) => (
                <StringInput
                  fullWidth
                  hasError={!!errors?.town}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldWrapper>
          <FieldWrapper label="Village or Region" error={errors?.region?.message as string}>
            <Controller
              control={control}
              name="region"
              render={({ field }) => (
                <StringInput
                  fullWidth
                  hasError={!!errors?.region}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Detailed Address" error={errors?.address?.message as string}>
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <StringInput
                fullWidth
                hasError={!!errors?.address}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FieldWrapper>

        <FieldWrapper label="Phone Number" error={errors?.phone?.message as string}>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <StringInput
                fullWidth
                hasError={!!errors?.phone}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FieldWrapper>

        <div className={styles.checkoutPageFormRow}>
          <FieldWrapper label="Save this address?">
            <Controller
              control={control}
              name="saveAddress"
              render={({ field }) => (
                <Select
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  value={field.value ? 'yes' : 'no'}
                  onChange={(val) => field.onChange(val === 'yes')}
                />
              )}
            />
          </FieldWrapper>
          <FieldWrapper label="Coupon Code (optional)">
            <div style={{ display: 'flex', gap: 8 }}>
              <Controller
                control={control}
                name="couponCode"
                render={({ field }) => (
                  <StringInput
                    value={field.value || ''}
                    onChange={(v) => field.onChange(String(v))}
                    onKeyDown={(e) => {
                      if ((e as any).key === 'Enter') {
                        e.preventDefault();
                        validateAndPreview();
                      }
                    }}
                    fullWidth
                  />
                )}
              />
              <Button
                appearance="outline"
                onClick={async () => {
                  await validateAndPreview();
                }}
                isLoading={validateCoupon.isPending}
                isDisabled={validateCoupon.isPending || !String(watch('couponCode') || '').trim()}
              >
                Apply
              </Button>
              <Button
                size="medium"
                appearance="outline"
                leftIcon={faTrashAlt}
                onClick={() => {
                  setValue('couponCode', '');
                  setCouponApplied(false);
                  setCouponMessage('');
                  onCouponPreview?.({
                    code: '',
                    applied: false,
                    discount: 0,
                    previewTotal: null,
                    message: '',
                  });
                }}
                aria-label="Delete"
                isDisabled={validateCoupon.isPending || !String(watch('couponCode') || '').trim()}
              />
            </div>
            {couponMessage && (
              <div className={couponApplied ? 'bts-textSuccess' : 'bts-textDanger'}>
                {couponMessage}
              </div>
            )}
          </FieldWrapper>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={!!placing}
          isDisabled={!!placing || !!disableSubmit || !formState.isValid}
        >
          Place Order
        </Button>
      </form>
    </FormProvider>
  );
};

export default ShippingForm;
