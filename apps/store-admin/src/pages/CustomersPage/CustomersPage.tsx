import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Table, Button } from '@baby-toys/ui-kit';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { User } from '@baby-toys/types/src';
import { useNavigate } from 'react-router-dom';

const CustomersPage: React.FC = () => {
  const { getCustomers } = useMockAdminApi();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCustomers()
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [getCustomers]);

  const columns = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: User) => (
        <Button appearance="outline" onClick={() => navigate(`/orders?email=${row.email}`)}>
          View Orders
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Heading className="bts-marginBm">Customers</Heading>
      <Table value={customers} columns={columns} isLoading={loading} />
    </AdminLayout>
  );
};

export default CustomersPage;
