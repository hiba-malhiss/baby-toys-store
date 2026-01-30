import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import TownAnalyticsTable from '../DashboardPage/TownAnalyticsTable';

const TownAnalyticsPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="bts-paddingM">
        <TownAnalyticsTable />
      </div>
    </AdminLayout>
  );
};

export default TownAnalyticsPage;
