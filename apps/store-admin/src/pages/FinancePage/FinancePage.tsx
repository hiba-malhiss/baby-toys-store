import React, { useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Button, Flex, Heading, Table, Calendar, Tooltip } from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import { useFinancePage } from './useFinancePage';
import { faEye, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const FinancePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { year, setYear, data, isLoading } = useFinancePage();

  const HeaderWithTooltip: React.FC<{ label: string; tip: string }> = ({ label, tip }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span>{label}</span>
      <Tooltip position="top" content={tip}>
        <span>
          <FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.7, cursor: 'help' }} />
        </span>
      </Tooltip>
    </span>
  );

  const columns = useMemo(() => [
    { field: 'month', header: t('finance.month') },
    { field: 'income', header: <HeaderWithTooltip label={t('finance.income')} tip={t('tooltips.financeHeaders.income')} /> },
    { field: 'cogs', header: <HeaderWithTooltip label={t('finance.cogs')} tip={t('tooltips.financeHeaders.cogs')} /> },
    { field: 'expenses', header: <HeaderWithTooltip label={t('finance.expenses')} tip={t('tooltips.financeHeaders.expenses')} /> },
    { field: 'profit', header: <HeaderWithTooltip label={t('finance.profit')} tip={t('tooltips.financeHeaders.profit')} /> },
    {
      header: t('app.actions'),
      body: (row: any) => (
        <Button
          size="small"
          appearance="outline"
          leftIcon={faEye}
          onClick={() => navigate(`/finance/${row.month}`)}
          aria-label={t('finance.viewProduct')}
        />
      ),
    },
  ], [navigate, t]);

  const currentYearMoment = useMemo(() => moment(String(year), 'YYYY') as any, [year]);

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading>{t('finance.title')}</Heading>
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
