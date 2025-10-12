import React, { useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Flex, Heading, Select, Option, Table } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import { useFinancePage } from './useFinancePage';
import { faEye } from "@fortawesome/free-solid-svg-icons";

const FinancePage: React.FC = () => {
  const navigate = useNavigate();
  const { year, setYear, data, isLoading } = useFinancePage();

  const columns = useMemo(() => [
    { field: 'month', header: 'Month' },
    { field: 'income', header: 'Income' },
    { field: 'cogs', header: 'COGS' },
    { field: 'expenses', header: 'Expenses' },
    { field: 'profit', header: 'Profit' },
    {
      header: 'Actions',
      body: (row: any) => (
        <Button
          size="small"
          appearance="outline"
          leftIcon={faEye}
          onClick={() => navigate(`/finance/${row.month}`)}
          aria-label="View product"
        />
      ),
    },
  ], [navigate]);

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return [now - 1, now, now + 1];
  }, []);

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>Finance - Monthly Profit</Heading>
          <Flex spacing="s" align="center">
            <Select value={String(year)} onChange={(v) => setYear(Number(v))}>
              {years.map((y) => (
                <Option key={y} value={String(y)}>{y}</Option>
              ))}
            </Select>
          </Flex>
        </Flex>

        <Table
          value={data}
          columns={columns as any}
          isLoading={isLoading}
        />
      </Flex>
    </AdminLayout>
  );
};

export default FinancePage;
