import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdminRedirect: React.FC = () => {
  const { t } = useTranslation('common');
  useEffect(() => {
    const configured = import.meta.env.VITE_ADMIN_URL;
    const fallback = `${window.location.origin}/admin`;
    window.location.href = configured || fallback;
  }, []);

  return <div>{t('admin.redirecting')}</div>;
};

export default AdminRedirect;
