import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, PageHeader } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';
import TownAnalyticsTable from '../DashboardPage/TownAnalyticsTable';

const TownAnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AdminLayout>
      <PageHeader
        left={<Heading>{t('menu.townAnalytics', { defaultValue: 'Town Analytics' })}</Heading>}
      />
      <TownAnalyticsTable />
    </AdminLayout>
  );
};

export default TownAnalyticsPage;
