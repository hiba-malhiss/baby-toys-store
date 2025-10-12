import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useParams } from 'react-router-dom';
import { useMonthDetailPage } from './useMonthDetailPage';
import { Flex, Heading, Table, KPI } from '@baby-toys/ui-kit';

const MonthDetailPage: React.FC = () => {
  const { yearMonth } = useParams();
  const { data, isLoading } = useMonthDetailPage(yearMonth!);

  const orderColumns = [
    { field: 'orderNumber', header: 'Order #' },
    { field: 'status', header: 'Status' },
    { field: 'deliveredAt', header: 'Delivered At' },
    { field: 'total', header: 'Total' },
  ];

  const expenseColumns = [
    { field: 'date', header: 'Date' },
    { field: 'category', header: 'Category' },
    { field: 'amount', header: 'Amount' },
    { field: 'description', header: 'Description' },
  ];

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Heading>Finance - {yearMonth}</Heading>

        {data?.summary && (
          <Flex justify="between" align="stretch" spacing="l" fullWidth>
            <KPI label="Income" value={String(data.summary.income)} fullWidth/>
            <KPI label="COGS" value={String(data.summary.cogs)} fullWidth/>
            <KPI label="Expenses" value={String(data.summary.expenses)} fullWidth/>
            <KPI label="Profit" value={String(data.summary.profit)} fullWidth/>
            <KPI label="# Orders" value={String(data.summary.ordersCount)} fullWidth/>
          </Flex>
        )}


        <Table fullWidth title="Delivered Orders" value={data?.orders ?? []} columns={orderColumns as any}
               isLoading={isLoading}/>
        <Table fullWidth title="Expenses" value={data?.expenses ?? []} columns={expenseColumns as any}
               isLoading={isLoading}/>
      </Flex>
    </AdminLayout>
  );
};

export default MonthDetailPage;
