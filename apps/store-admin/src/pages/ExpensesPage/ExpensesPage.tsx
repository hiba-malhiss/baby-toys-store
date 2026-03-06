import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Dialog,
  Flex,
  Heading,
  StringInput,
  Table,
  Calendar,
  useToast,
} from '@baby-toys/ui-kit';
import { useExpensesPage } from './useExpensesPage.tsx';
import moment from 'moment';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';

const CalendarFieldAdapter: React.FC<{
  value?: Date | null;
  onChange?: (d: Date | null) => void;
}> = ({ value, onChange }) => (
  <Calendar
    value={value ? (moment(value) as any) : (undefined as any)}
    onChange={(m) => {
      const next = Array.isArray(m)
        ? m[0]
          ? m[0].toDate()
          : null
        : ((m as any)?.toDate?.() ?? null);
      onChange?.(next);
    }}
    selectionMode="single"
    typeView="date"
    fullWidth
  />
);

const ExpensesPage: React.FC = () => {
  const {
    yearMonth,
    setYearMonth,
    expenses,
    isLoading,
    handleCreate,
    isOpen,
    setIsOpen,
    columns,
    control,
    handleSubmit,
    reset,
    isSubmitting,
  } = useExpensesPage();
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Flex direction="vertical" spacing="s">
            <Heading>{t('app.expenses.title')}</Heading>
            <Heading level="h4" appearance="light">
              {t('app.expenses.description')}
            </Heading>
          </Flex>
          <Flex spacing="s" align="center">
            <Calendar
              value={moment(yearMonth + '-01', 'YYYY-MM-DD') as any}
              onChange={(m) => {
                const d = Array.isArray(m) ? m[0] : (m as any);
                if (!d) return;
                const ym = (d as any).format
                  ? (d as any).format('YYYY-MM')
                  : moment(d).format('YYYY-MM');
                setYearMonth(ym);
              }}
              selectionMode="single"
              typeView="month"
            />
            <Button onClick={() => setIsOpen(true)}>{t('app.expenses.addExpense')}</Button>
          </Flex>
        </Flex>
        <Table value={expenses} columns={columns as any} isLoading={isLoading} stripedRows />
        <Dialog
          visible={isOpen}
          onHide={() => setIsOpen(false)}
          header={t('app.expenses.addExpense')}
          footer={
            <Flex justify="end" spacing="s">
              <Button appearance="outline" onClick={() => setIsOpen(false)}>
                {t('app.common.cancel')}
              </Button>
              <Button
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                onClick={handleSubmit(
                  async (data) => {
                    try {
                      const payload = {
                        date: data.date ? moment(data.date).format('YYYY-MM-DD') : '',
                        amount: Number(data.amount || 0),
                        category: data.category || '',
                        description: data.description || '',
                      };
                      await handleCreate(payload as any);
                      setIsOpen(false);
                      reset();
                      toast.success(t('app.expenses.addSuccess'));
                    } catch (e: any) {
                      toast.error(e?.message || t('app.expenses.addError'));
                    }
                  },
                  () =>
                    toast.error(
                      t('app.formInvalid', { defaultValue: 'Please fix the highlighted fields.' })
                    )
                )}
              >
                {t('app.common.save')}
              </Button>
            </Flex>
          }
        >
          <Flex direction="vertical" spacing="m">
            <FormFieldWrapper
              name="date"
              control={control}
              label={t('app.expenses.form.date')}
              required
              fullWidth
            >
              <CalendarFieldAdapter />
            </FormFieldWrapper>
            <FormFieldWrapper
              name="amount"
              control={control}
              label={t('app.expenses.form.amount')}
              required
              fullWidth
            >
              <StringInput type="number" placeholder={t('app.expenses.form.amountPlaceholder')} />
            </FormFieldWrapper>
            <FormFieldWrapper
              name="category"
              control={control}
              label={t('app.expenses.form.category')}
              fullWidth
            >
              <StringInput placeholder={t('app.expenses.form.categoryPlaceholder')} />
            </FormFieldWrapper>
            <FormFieldWrapper
              name="description"
              control={control}
              label={t('app.expenses.form.description')}
              fullWidth
            >
              <StringInput placeholder={t('app.expenses.form.descriptionPlaceholder')} />
            </FormFieldWrapper>
          </Flex>
        </Dialog>
      </Flex>
    </AdminLayout>
  );
};

export default ExpensesPage;
