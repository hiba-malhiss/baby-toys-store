import React, { useEffect } from 'react';
import { Dialog, StringInput, Button, Flex, useToast, Calendar, Chip } from '@baby-toys/ui-kit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { Coupon } from '../../api/types/coupon';
import { useCreateCoupon, useUpdateCoupon } from '../../api/couponApi';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { CouponFormValues, couponSchema } from './coupons-page.utils.ts';
import { useTranslation } from 'react-i18next';

// Bridges RHF Date value to UI Kit Calendar (Moment-based) without inline factory
const CalendarFieldAdapter: React.FC<{
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  hasError?: boolean;
  isDisabled?: boolean;
}> = ({ hasError, value, onChange, isDisabled }) => (
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
    hasError={hasError}
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
  const { t } = useTranslation();
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
    },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  // trigger re-render on value change
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
    };

    const action = coupon ? 'update' : 'create';
    try {
      if (coupon) {
        await updateCoupon.mutateAsync({ id: coupon.id, data: payload });
        toast.success(t('coupons.dialog.success.updated'));
      } else {
        await createCoupon.mutateAsync(payload);
        toast.success(t('coupons.dialog.success.created'));
      }
      onSuccess();
      onHide();
      reset();
    } catch (error) {
      toast.error(t('coupons.dialog.success.error', { action }));
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={t(coupon ? 'coupons.dialog.editTitle' : 'coupons.dialog.addTitle')}
      footer={
        <Button
          onClick={handleSubmit(onSubmit, () =>
            toast.error(
              t('app.formInvalid', { defaultValue: 'Please fix the highlighted fields.' })
            )
          )}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          fullWidth
        >
          {t(coupon ? 'coupons.dialog.updateButton' : 'coupons.dialog.createButton')}
        </Button>
      }
    >
      <Flex direction="vertical" spacing="m" fullWidth>
        <FormFieldWrapper
          name="code"
          control={control}
          label={t('coupons.dialog.fields.code.label')}
          required
          fullWidth
        >
          <StringInput
            placeholder={t('coupons.dialog.fields.code.placeholder')}
            isDisabled={isSubmitting}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          name="description"
          control={control}
          label={t('coupons.dialog.fields.description.label')}
          fullWidth
        >
          <StringInput
            placeholder={t('coupons.dialog.fields.description.placeholder')}
            isDisabled={isSubmitting}
          />
        </FormFieldWrapper>

        <Flex spacing="m" fullWidth align="center">
          <FormFieldWrapper
            name="discountAmount"
            control={control}
            label={t('coupons.dialog.fields.discountAmount.label')}
            fullWidth
          >
            <StringInput
              type="number"
              isDisabled={isSubmitting || !!watchDiscountPercent}
              placeholder={t('coupons.dialog.fields.discountAmount.placeholder')}
              fullWidth
            />
          </FormFieldWrapper>
          <Chip className="bts-marginTxxl" label={t('coupons.dialog.or')} appearance="secondary" />
          <FormFieldWrapper
            name="discountPercent"
            control={control}
            label={t('coupons.dialog.fields.discountPercent.label')}
            fullWidth
          >
            <StringInput
              type="number"
              isDisabled={isSubmitting || !!watchDiscountAmount}
              placeholder={t('coupons.dialog.fields.discountPercent.placeholder')}
              fullWidth
            />
          </FormFieldWrapper>
        </Flex>

        <Flex spacing="m" fullWidth align="end">
          <FormFieldWrapper
            name="validFrom"
            control={control}
            label={t('coupons.dialog.fields.validFrom.label')}
            required
            fullWidth
          >
            <CalendarFieldAdapter isDisabled={isSubmitting} />
          </FormFieldWrapper>
          <FormFieldWrapper
            name="validUntil"
            control={control}
            label={t('coupons.dialog.fields.validUntil.label')}
            fullWidth
          >
            <CalendarFieldAdapter isDisabled={isSubmitting} />
          </FormFieldWrapper>
        </Flex>

        <FormFieldWrapper
          name="maxDiscount"
          control={control}
          label={t('coupons.dialog.fields.maxDiscount.label')}
          fullWidth
        >
          <StringInput
            type="number"
            isDisabled={isSubmitting}
            placeholder={t('coupons.dialog.fields.maxDiscount.placeholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          name="minOrderAmount"
          control={control}
          label={t('coupons.dialog.fields.minOrderAmount.label')}
          fullWidth
        >
          <StringInput
            type="number"
            isDisabled={isSubmitting}
            placeholder={t('coupons.dialog.fields.minOrderAmount.placeholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          name="maxUses"
          control={control}
          label={t('coupons.dialog.fields.maxUses.label')}
          fullWidth
        >
          <StringInput
            type="number"
            isDisabled={isSubmitting}
            placeholder={t('coupons.dialog.fields.maxUses.placeholder')}
          />
        </FormFieldWrapper>
      </Flex>
    </Dialog>
  );
};

export default CouponDialog;
