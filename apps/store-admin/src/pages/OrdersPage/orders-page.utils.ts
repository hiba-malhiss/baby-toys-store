export const orderStatusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const statusColorMap: Record<string, string> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'success',
  delivered: 'primary',
};
