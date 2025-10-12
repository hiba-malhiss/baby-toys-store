import React, { useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Flex, Heading, Table, Calendar } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import { useFinancePage } from './useFinancePage';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';

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

  const currentYearMoment = useMemo(() => moment(String(year), 'YYYY') as any, [year]);

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>Finance - Monthly Profit</Heading>
          <Flex spacing="s" align="center">
            <Calendar
              value={currentYearMoment}
              selectionMode="single"
              typeView="year"
              onChange={(m) => {
                const d = Array.isArray(m) ? m[0] : (m as any);
                if (!d) return;
                const y = (d as any).year ? (d as any).year() : moment(d).year();
                setYear(Number(y));
              }}
            />
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
