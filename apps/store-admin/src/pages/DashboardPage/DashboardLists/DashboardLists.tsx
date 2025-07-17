import React from 'react';
import { Card } from '@baby-toys/ui-kit/components';
import RecentOrdersTable from './RecentOrdersTable.tsx';
import styles from './dashboard-lists.module.scss';
import { OrderItem, Product } from '@baby-toys/types/src';

interface DashboardListsProps {
  lowStock: Product[];
  topSelling: Product[];
  recentOrders: OrderItem[];
}

const DashboardLists: React.FC<DashboardListsProps> = ({ lowStock, topSelling, recentOrders }) => (
  <div className={styles.dashboardLists}>
    {lowStock.length > 0 && (
      <Card size="small" header="Low Stock Alerts">
        <ul>
          {lowStock.map((product) => (
            <li key={product.id}>
              {product.name} ({product.availableInStock} left)
            </li>
          ))}
        </ul>
      </Card>
    )}

    {topSelling.length > 0 && (
      <Card size="small" header="Top Selling Products">
        <ul>
          {topSelling.map((product) => (
            <li key={product.id}>
              {product.name} ({product.sales} sales)
            </li>
          ))}
        </ul>
      </Card>
    )}

    <RecentOrdersTable recentOrders={recentOrders} />
  </div>
);

export default DashboardLists;
