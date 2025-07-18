import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { apiClient } from '../../api/apiClient';
import { OrderItem } from '@baby-toys/types/src';

const OrderDetailsPage: React.FC = () => {
  const { getOrderById } = useMockAdminApi();
  const [order, setOrder] = useState<OrderItem | null>(null);
  const { id } = useParams();

  useEffect(() => {
    apiClient.get(getOrderById, Number(id)).then(setOrder);
  }, [id, getOrderById]);

  return (
    <AdminLayout>
      <h1>Order Details</h1>
      <pre>{JSON.stringify(order, null, 2)}</pre>
    </AdminLayout>
  );
};

export default OrderDetailsPage;
