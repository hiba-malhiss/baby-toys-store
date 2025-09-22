import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  StringInputWithButton,
} from '@baby-toys/ui-kit/components';
import { faPlus, faPen, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import useCouponsPage from './useCouponsPage';
import CouponDialog from './CouponDialog';
import { Coupon } from '../../api/types/coupon';
import styles from './coupons-page.module.scss';

const CouponsPage: React.FC = () => {
  const {
    rowsPerPage,
    coupons,
    totalItems,
    isLoading,
    dialogVisible,
    setDialogVisible,
    editingCoupon,
    confirmDialogVisible,
    setConfirmDialogVisible,
    couponToDelete,
    handleDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handlePageChange,
    handleSort,
    sortField,
    sortDirection,
    handleSearch,
    searchInput,
    setSearchInput,
  } = useCouponsPage();

  const columns = [
    { header: 'Code', field: 'code', sortable: true },
    { header: 'Description', field: 'description' },
    {
      header: 'Discount Amount',
      field: 'discountAmount',
      sortable: true,
      body: (row: Coupon) => (row.discountAmount != null ? row.discountAmount.toFixed(2) : '-'),
    },
    {
      header: 'Discount %',
      field: 'discountPercent',
      sortable: true,
      body: (row: Coupon) => (row.discountPercent != null ? `${row.discountPercent}%` : '-'),
    },
    {
      header: 'Max Discount',
      field: 'maxDiscount',
      sortable: true,
      body: (row: Coupon) => (row.maxDiscount != null ? row.maxDiscount.toFixed(2) : '-'),
    },
    {
      header: 'Min Order',
      field: 'minOrderAmount',
      sortable: true,
      body: (row: Coupon) => (row.minOrderAmount != null ? row.minOrderAmount.toFixed(2) : '-'),
    },
    {
      header: 'Valid From',
      field: 'validFrom',
      sortable: true,
      body: (row: Coupon) => (row.validFrom ? new Date(row.validFrom).toLocaleString() : '-'),
    },
    {
      header: 'Valid Until',
      field: 'validUntil',
      sortable: true,
      body: (row: Coupon) => (row.validUntil ? new Date(row.validUntil).toLocaleString() : '-'),
    },
    { header: 'Max Uses', field: 'maxUses', sortable: true },
    { header: 'Used', field: 'currentUses', sortable: true },
    {
      header: 'Actions',
      field: 'actions',
      body: (coupon: Coupon) => (
        <Flex spacing="m">
          <Button
            size="small"
            leftIcon={faPen}
            appearance="outline"
            onClick={() => openEditDialog(coupon)}
          />
          <Button
            size="small"
            leftIcon={faTrashAlt}
            appearance="outline"
            onClick={() => openDeleteDialog(coupon)}
          />
        </Flex>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="xl" fullWidth>
        <Flex justify="between" align="center" fullWidth>
          <Heading level="h1">Coupons</Heading>
          <Flex align="center" spacing="xl">
            <StringInputWithButton
              placeholder="Search by code..."
              buttonIcon={faSearch}
              onClear={() => handleSearch('')}
              value={searchInput}
              onChange={(val) => setSearchInput(val)}
              onClick={() => handleSearch(searchInput)}
            />
            <Button onClick={openAddDialog} leftIcon={faPlus} className={styles.couponsPageAddBtn}>
              Add Coupon
            </Button>
          </Flex>
        </Flex>

        <Table
          columns={columns}
          value={coupons}
          isLoading={isLoading}
          paginator
          rows={rowsPerPage}
          totalRecords={totalItems}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortDirection === 'ASC' ? 1 : -1}
          selectionMode="multiple"
          emptyMessage="No coupons found"
          stripedRows
        />

        <CouponDialog
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          onSuccess={() => setDialogVisible(false)}
          coupon={editingCoupon}
        />

        <ConfirmDialog
          visible={confirmDialogVisible}
          header="Confirm Delete"
          message={`Are you sure you want to delete "${couponToDelete?.code}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialogVisible(false)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default CouponsPage;
