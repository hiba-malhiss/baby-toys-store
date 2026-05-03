import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Flex,
  Heading,
  Table,
  Calendar,
  Tooltip,
  Icon,
  PageHeader,
} from '@baby-toys/ui-kit';
import { useNavigate } from 'react-router-dom';
import { useFinancePage } from './useFinancePage';
import { Eye, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useMemo } from 'react';

const FinancePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { year, setYear, data, isLoading } = useFinancePage();

  const HeaderWithTooltip: React.FC<{ label: string; tip: string }> = ({ label, tip }) => (
    <Flex align="center" spacing="s">
      <span>{label}</span>
      <Tooltip position="top" content={tip}>
        <div>
          <Icon icon={Info} />
        </div>
      </Tooltip>
    </Flex>
  );

  const columns = useMemo(
    () => [
      { field: 'month', header: t('finance.month') },
      {
        field: 'income',
        header: (
          <HeaderWithTooltip
            label={t('finance.income')}
            tip={t('tooltips.financeHeaders.income')}
          />
        ),
      },
      {
        field: 'cogs',
        header: (
          <HeaderWithTooltip label={t('finance.cogs')} tip={t('tooltips.financeHeaders.cogs')} />
        ),
      },
      {
        field: 'expenses',
        header: (
          <HeaderWithTooltip
            label={t('finance.expenses')}
            tip={t('tooltips.financeHeaders.expenses')}
          />
        ),
      },
      {
        field: 'profit',
        header: (
          <HeaderWithTooltip
            label={t('finance.profit')}
            tip={t('tooltips.financeHeaders.profit')}
          />
        ),
      },
      {
        header: t('app.actions'),
        body: (row: any) => (
          <Tooltip
            position="top"
            content={t('finance.viewMonth', { defaultValue: 'View month detail' })}
          >
            <Button
              size="small"
              appearance="outline"
              leftIconComp={Eye}
              onClick={() => navigate(`/finance/${row.month}`)}
              aria-label={t('finance.viewProduct')}
            />
          </Tooltip>
        ),
      },
    ],
    [navigate, t]
  );

  const currentYearMoment = useMemo(() => moment(String(year), 'YYYY') as any, [year]);

  return (
    <AdminLayout>
      <PageHeader
        left={
          <Flex direction="vertical" spacing="xs">
            <Heading>{t('finance.title', { defaultValue: 'Finance' })}</Heading>
            <Heading level="h4" appearance="light">
              {t('finance.subtitle', { defaultValue: 'Monthly revenue, COGS, expenses & profit' })}
            </Heading>
          </Flex>
        }
        right={
          <Calendar
            value={currentYearMoment}
            onChange={(m) => {
              const d = Array.isArray(m) ? m[0] : (m as any);
              if (!d) return;
              const yr = (d as any).format ? (d as any).format('YYYY') : moment(d).format('YYYY');
              setYear(Number(yr));
            }}
            selectionMode="single"
            typeView="year"
            fullWidth={false}
          />
        }
      />

      <Table
        stripedRows
        value={data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={t('finance.empty', { defaultValue: 'No financial data for this year.' })}
      />
    </AdminLayout>
  );
};

export default FinancePage;
