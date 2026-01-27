import React from 'react';
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
  const toast = useToast();

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Flex direction="vertical" spacing="s">
            <Heading>Expenses</Heading>
            <Heading level="h4" appearance="light">
              Admin-recorded operating costs. Expenses are aggregated by month and deducted from
              gross profit (Revenue − COGS) to compute net profit.
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
            <Button onClick={() => setIsOpen(true)}>Add Expense</Button>
          </Flex>
        </Flex>
        <Table value={expenses} columns={columns as any} isLoading={isLoading} stripedRows />
        <Dialog
          visible={isOpen}
          onHide={() => setIsOpen(false)}
          header="Add Expense"
          footer={
            <Flex justify="end" spacing="s">
              <Button appearance="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                onClick={handleSubmit(async (data) => {
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
                    toast.success('Expense added');
                  } catch (e: any) {
                    toast.error(e?.message || 'Failed to add expense');
                  }
                })}
              >
                Save
              </Button>
            </Flex>
          }
        >
          <Flex direction="vertical" spacing="m">
            <FormFieldWrapper name="date" control={control} label="Date" required fullWidth>
              <CalendarFieldAdapter />
            </FormFieldWrapper>
            <FormFieldWrapper name="amount" control={control} label="Amount" required fullWidth>
              <StringInput type="number" placeholder="0.00" />
            </FormFieldWrapper>
            <FormFieldWrapper name="category" control={control} label="Category" fullWidth>
              <StringInput placeholder="e.g., Delivery cost" />
            </FormFieldWrapper>
            <FormFieldWrapper name="description" control={control} label="Description" fullWidth>
              <StringInput placeholder="Optional description" />
            </FormFieldWrapper>
          </Flex>
        </Dialog>
      </Flex>
    </AdminLayout>
  );
};

export default ExpensesPage;
