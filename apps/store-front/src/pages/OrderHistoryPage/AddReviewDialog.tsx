import { useEffect } from 'react';
import {
  Dialog,
  Button,
  Rating,
  useToast,
  Flex,
  Heading,
  TextArea,
  Image,
} from '@baby-toys/ui-kit';
import type { OrderItem } from '../../api/ordersApi';
import { useCreateReview, useUpdateMyReview, useGetMyReview } from '../../api/reviewsApi';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import type { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

interface AddReviewDialogProps {
  open: boolean;
  onClose: () => void;
  item?: OrderItem | null;
  onSubmitSuccess?: (reviewData: { rating: number; comment: string }) => void;
}

const AddReviewDialog = ({ open, onClose, item, onSubmitSuccess }: AddReviewDialogProps) => {
  const toast = useToast();
  const { t } = useTranslation('common');
  const isEdit = !!item?.canEditReview && !!item?.reviewId;

  const schema = z.object({
    rating: z.number({ message: t('reviews.dialog.rating') as string }).min(1).max(5),
    comment: z.string().trim().min(1, 'Comment too short').max(500),
  });
  type FormValues = z.infer<typeof schema>;

  const createMutation = useCreateReview();
  const updateMutation = useUpdateMyReview();
  const { data: myReview } = useGetMyReview(item?.reviewId ?? null, isEdit && open);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { rating: 0, comment: '' },
  });

  useEffect(() => {
    if (!open) return;
    if (isEdit && myReview) {
      reset({ rating: Number(myReview.rating) || 0, comment: myReview.comment || '' });
    } else {
      reset({ rating: 0, comment: '' });
    }
  }, [open, isEdit, myReview, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!item) return;
    try {
      if (isEdit && item.reviewId) {
        await updateMutation.mutateAsync({
          id: item.reviewId,
          comment: values.comment,
          rating: values.rating,
        });
      } else {
        await createMutation.mutateAsync({
          orderItemId: Number(item.orderItemId),
          productId: Number(item.product.id),
          rating: values.rating,
          comment: values.comment,
        });
      }
      onSubmitSuccess?.(values);
      reset();
      onClose();
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message ?? t('reviews.dialog.error'));
    }
  });

  const onCloseDialog = () => {
    onClose();
    reset();
  };

  if (!item) return null;
  const { product } = item;

  return (
    <Dialog
      header={isEdit ? t('reviews.dialog.editHeader') : t('reviews.dialog.addHeader')}
      visible={open}
      onVisibleChange={onCloseDialog}
      modal
      closable
    >
      <Flex direction="vertical" spacing="xxl" fullWidth>
        <Flex>
          <Image src={product.mainImage} alt={product.name} width={120} height={120} />
          <Heading level="h4" className="bts-marginVxl">
            {product.name}
          </Heading>
        </Flex>

        <FormFieldWrapper control={control} name="rating" label={t('reviews.dialog.rating')} required fullWidth>
          <Rating size="xlarge" />
        </FormFieldWrapper>

        <FormFieldWrapper control={control} name="comment" label={t('reviews.dialog.comment')} fullWidth>
          <TextArea fullWidth placeholder={t('reviews.dialog.commentPlaceholder')} />
        </FormFieldWrapper>

        <Button
          onClick={onSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
          color="primary"
          fullWidth
          isDisabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEdit ? t('reviews.dialog.update') : t('reviews.dialog.submit')}
        </Button>
      </Flex>
    </Dialog>
  );
};

export default AddReviewDialog;
