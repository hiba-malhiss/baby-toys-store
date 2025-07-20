import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { OrderItem } from '@baby-toys/types/src';
import { Card, Chip, Select, Option, Button, Flex, Heading } from '@baby-toys/ui-kit/components';
import styles from './order-details-page.module.scss';
import CartItemAdmin from '../../components/CartItemAdmin/CartItemAdmin';
import { useAdminStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';
import { orderStatusOptions, statusColorMap } from '../OrdersPage/orders-page.utils.ts';

interface OrderDetailsPageProps {
  isEdit?: boolean;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ isEdit }) => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrder } = useMockAdminApi();
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { currency } = useAdminStoreConfiguration();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getOrderById(Number(id))
        .then((data) => {
          setOrder(data || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, getOrderById]);

  const handleStatusChange = (newStatus: string) => {
    if (order) {
      setOrder({ ...order, status: newStatus });
    }
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    if (order) {
      const updatedCartItems = order.cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const total = updatedCartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setOrder({ ...order, cartItems: updatedCartItems, total });
    }
  };

  const handleDeleteItem = (itemId: number) => {
    if (order) {
      const updatedCartItems = order.cartItems.filter((item) => item.id !== itemId);
      const total = updatedCartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setOrder({ ...order, cartItems: updatedCartItems, total });
    }
  };

  const handleSaveChanges = () => {
    if (order) {
      updateOrder(order).then(() => navigate('/orders'));
    }
  };

  if (loading) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  if (!order) {
    return <AdminLayout>Order not found.</AdminLayout>;
  }

  return (
    <AdminLayout>
      <Flex justify="between" className="bts-marginBxxl">
        <Heading>{isEdit ? `Edit Order #${order.id}` : `Order #${order.id}`}</Heading>
        {isEdit ? (
          <Select value={order.status} onChange={(val) => handleStatusChange(val as string)}>
            {orderStatusOptions.map(({ label, value }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        ) : (
          <Chip label={order.status} color={statusColorMap[order.status]} />
        )}
      </Flex>

      <Flex spacing="xxl" align="stretch">
        <Card
          header={
            <Flex justify="between" fullWidth align="center">
              <Heading level="h3">Order items</Heading>
              {!isEdit && (
                <Button appearance="outline" onClick={() => navigate(`/order-edit/${order.id}`)}>
                  Edit
                </Button>
              )}
            </Flex>
          }
          className={styles.orderDetailsItems}
        >
          {order.cartItems.map((item) => (
            <CartItemAdmin
              key={item.id}
              item={item}
              isEdit={isEdit}
              onQuantityChange={handleQuantityChange}
              onDeleteItem={handleDeleteItem}
            />
          ))}
          <Flex justify="between" className="bts-bold">
            <span>Total</span>
            <span>
              {order.total.toFixed(2)}
              {currency?.symbol}
            </span>
          </Flex>
        </Card>
        <Card header={<Heading level="h3">Customer & Shipping</Heading>}>
          <Flex spacing="xl" direction="vertical">
            <Flex spacing="s">
              <strong className="bts-bold">Email:</strong> {order.email}
            </Flex>
            {Object.entries(order.shippingInfo || {}).map(([key, value]) => (
              <Flex spacing="s">
                <strong className="bts-bold">{key}:</strong> {value}
              </Flex>
            ))}
          </Flex>
        </Card>
      </Flex>
      {isEdit && (
        <Flex justify="end" fullWidth>
          <Button className="bts-marginTxxl" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Flex>
      )}
    </AdminLayout>
  );
};

export default OrderDetailsPage;
