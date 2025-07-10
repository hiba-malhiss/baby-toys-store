import React, { useEffect } from 'react';

const AdminRedirect: React.FC = () => {
  useEffect(() => {
    window.location.href = 'http://localhost:5173';
  }, []);

  return <div>Redirecting to admin...</div>;
};

export default AdminRedirect;
