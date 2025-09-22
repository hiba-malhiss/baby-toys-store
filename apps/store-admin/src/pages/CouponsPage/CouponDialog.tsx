import React, { useEffect } from 'react';
import {
  Dialog,
  StringInput,
  Button,
  Flex,
  useToast,
  Calendar,
  Chip,
} from '@baby-toys/ui-kit/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { Coupon } from '../../api/types/coupon';
import { useCreateCoupon, useUpdateCoupon } from '../../api/couponApi';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { CouponFormValues, couponSchema } from './coupons-page.utils.ts';

// Bridges RHF Date value to UI Kit Calendar (Moment-based) without inline factory
const CalendarFieldAdapter: React.FC<{
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  isDisabled?: boolean;
}> = ({ value, onChange, isDisabled }) => (
  <Calendar
    value={value ? moment(value) : (undefined as any)}
    onChange={(m) => {
      const next = Array.isArray(m)
        ? m[0]
          ? m[0].toDate()
          : null
        : ((m as any)?.toDate?.() ?? null);
      onChange?.(next);
    }}
    isDisabled={isDisabled}
    disableFutureDates={false}
    selectionMode="single"
    typeView="date"
    fullWidth
  />
);

interface CouponDialogProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
  coupon?: Coupon | null;
}

const CouponDialog: React.FC<CouponDialogProps> = ({ visible, onHide, onSuccess, coupon }) => {
  const toast = useToast();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      description: '',
      discountAmount: null,
      discountPercent: null,
      maxDiscount: null,
      minOrderAmount: null,
      validFrom: new Date(),
      validUntil: null,
      maxUses: null,
      isActive: true,
    },
  });

  const watchDiscountAmount = watch('discountAmount');
  const watchDiscountPercent = watch('discountPercent');

  useEffect(() => {
    if (coupon) {
      reset({
        code: coupon.code,
        description: coupon.description ?? null,
        discountAmount: coupon.discountAmount ?? null,
        discountPercent: coupon.discountPercent ?? null,
        maxDiscount: coupon.maxDiscount ?? null,
        minOrderAmount: coupon.minOrderAmount ?? null,
        validFrom: new Date(coupon.validFrom),
        validUntil: coupon.validUntil ? new Date(coupon.validUntil) : null,
        maxUses: coupon.maxUses ?? null,
        isActive: coupon.isActive ?? true,
      });
    } else {
      reset();
    }
  }, [coupon, reset]);

  const onSubmit = async (data: CouponFormValues) => {
    const payload = {
      ...data,
      // Ensure number fields are undefined if they are null for the API
      discountAmount: data.discountAmount ?? undefined,
      discountPercent: data.discountPercent ?? undefined,
      maxDiscount: data.maxDiscount ?? undefined,
      minOrderAmount: data.minOrderAmount ?? undefined,
      // Convert Date objects to backend LocalDateTime strings
      validFrom: data.validFrom
        ? moment(data.validFrom).format('YYYY-MM-DD[T]HH:mm:ss')
        : undefined,
      validUntil: data.validUntil
        ? moment(data.validUntil).format('YYYY-MM-DD[T]HH:mm:ss')
        : undefined,
      maxUses: data.maxUses ?? undefined,
      isActive: data.isActive ?? undefined,
    };

    try {
      if (coupon) {
        await updateCoupon.mutateAsync({ id: coupon.id, data: payload });
        toast.success('Coupon updated successfully');
      } else {
        await createCoupon.mutateAsync(payload);
        toast.success('Coupon created successfully');
      }
      onSuccess();
      onHide();
      reset();
    } catch (error) {
      toast.error(error?.message || `Failed to ${coupon ? 'update' : 'create'} coupon `);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={coupon ? 'Edit Coupon' : 'Add New Coupon'}
      footer={
        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          fullWidth
        >
          {coupon ? 'Update' : 'Create'}
        </Button>
      }
    >
      <Flex direction="vertical" spacing="m" fullWidth>
        <FormFieldWrapper name="code" control={control} label="Coupon Code" required fullWidth>
          <StringInput placeholder="Enter coupon code" isDisabled={isSubmitting} />
        </FormFieldWrapper>

        <FormFieldWrapper name="description" control={control} label="Description" fullWidth>
          <StringInput placeholder="Enter description" isDisabled={isSubmitting} />
        </FormFieldWrapper>
        <Flex spacing="m" fullWidth align="center">
          <FormFieldWrapper
            name="discountAmount"
            control={control}
            label="Discount Amount"
            fullWidth
          >
            <StringInput
              type="number"
              isDisabled={isSubmitting || !!watchDiscountPercent}
              placeholder="e.g., 10.00"
              fullWidth
            />
          </FormFieldWrapper>
          <Chip className="bts-marginTxxl" label="OR" appearance="secondary" />
          <FormFieldWrapper
            name="discountPercent"
            control={control}
            label="Discount Percent"
            fullWidth
          >
            <StringInput
              type="number"
              isDisabled={isSubmitting || !!watchDiscountAmount}
              placeholder="e.g., 15"
              fullWidth
            />
          </FormFieldWrapper>
        </Flex>
        <Flex spacing="m" fullWidth>
          <FormFieldWrapper
            name="validFrom"
            control={control}
            label="Valid From"
            required
            fullWidth
          >
            <CalendarFieldAdapter isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper name="validUntil" control={control} label="Valid Until" fullWidth>
            <CalendarFieldAdapter isDisabled={isSubmitting} />
          </FormFieldWrapper>
        </Flex>

        <FormFieldWrapper name="maxDiscount" control={control} label="Max Discount" fullWidth>
          <StringInput type="number" isDisabled={isSubmitting} placeholder="e.g., 50.00" />
        </FormFieldWrapper>

        <FormFieldWrapper
          name="minOrderAmount"
          control={control}
          label="Min Order Amount"
          fullWidth
        >
          <StringInput type="number" isDisabled={isSubmitting} placeholder="e.g., 20.00" />
        </FormFieldWrapper>

        <FormFieldWrapper name="maxUses" control={control} label="Max Uses" fullWidth>
          <StringInput type="number" isDisabled={isSubmitting} placeholder="e.g., 100" />
        </FormFieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default CouponDialog;
