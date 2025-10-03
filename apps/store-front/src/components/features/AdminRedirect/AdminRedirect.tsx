import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdminRedirect: React.FC = () => {
  const { t } = useTranslation('common');
  useEffect(() => {
    window.location.href = 'http://localhost:5173';
  }, []);

  return <div>{t('admin.redirecting')}</div>;
};

export default AdminRedirect;
