import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Button,
  Flex,
  Table,
  Heading,
  ConfirmDialog,
  StringInput,
  Toggle,
} from '@baby-toys/ui-kit';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
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
    includeDeleted,
    setIncludeDeleted,
  } = useCouponsPage();

  const { t } = useTranslation();

  const columns = [
    {
      header: t('coupons.columns.code'),
      field: 'code',
      sortable: true,
    },
    {
      header: t('coupons.columns.description'),
      field: 'description',
    },
    {
      header: t('coupons.columns.discountAmount'),
      field: 'discountAmount',
      sortable: true,
      body: (row: Coupon) => (row.discountAmount != null ? row.discountAmount.toFixed(2) : '-'),
    },
    {
      header: t('coupons.columns.discountPercent'),
      field: 'discountPercent',
      sortable: true,
      body: (row: Coupon) => (row.discountPercent != null ? `${row.discountPercent}%` : '-'),
    },
    {
      header: t('coupons.columns.maxDiscount'),
      field: 'maxDiscount',
      sortable: true,
      body: (row: Coupon) => (row.maxDiscount != null ? row.maxDiscount.toFixed(2) : '-'),
    },
    {
      header: t('coupons.columns.minOrderAmount'),
      field: 'minOrderAmount',
      sortable: true,
      body: (row: Coupon) => (row.minOrderAmount != null ? row.minOrderAmount.toFixed(2) : '-'),
    },
    {
      header: t('coupons.columns.validFrom'),
      field: 'validFrom',
      sortable: true,
      body: (row: Coupon) => (row.validFrom ? new Date(row.validFrom).toLocaleString() : '-'),
    },
    {
      header: t('coupons.columns.validUntil'),
      field: 'validUntil',
      sortable: true,
      body: (row: Coupon) => (row.validUntil ? new Date(row.validUntil).toLocaleString() : '-'),
    },
    {
      header: t('coupons.columns.maxUses'),
      field: 'maxUses',
      sortable: true,
    },
    {
      header: t('coupons.columns.currentUses'),
      field: 'currentUses',
      sortable: true,
    },
    {
      header: t('coupons.columns.actions'),
      field: 'actions',
      body: (coupon: Coupon) => (
        <Flex spacing="m">
          <Button
            size="small"
            leftIconComp={Pencil}
            appearance="outline"
            onClick={() => openEditDialog(coupon)}
          />
          <Button
            size="small"
            leftIconComp={Trash2}
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
          <Flex direction="vertical" spacing="s">
            <Heading level="h1">{t('coupons.title')}</Heading>
            <Heading level="h4" appearance="light">
              {t('coupons.subtitle')}
            </Heading>
          </Flex>
          <Flex align="center" spacing="xl">
            <StringInput
              placeholder={t('coupons.searchPlaceholder')}
              value={searchInput}
              className={styles.couponsPageSearch}
              onChange={(val) => {
                const v = String(val ?? '');
                setSearchInput(v);
                if (!v.length) {
                  handleSearch('');
                }
              }}
              iconRight={Search}
              withIconBackground
              onIconClick={() => handleSearch(searchInput)}
              fullWidth
            />
            <Flex align="center" spacing="s">
              <Toggle checked={includeDeleted} onChange={(v) => setIncludeDeleted(!!v)} />
              <span>{t('coupons.showDeleted')}</span>
            </Flex>
            <Button
              onClick={openAddDialog}
              leftIconComp={Plus}
              className={styles.couponsPageAddBtn}
            >
              {t('coupons.addButton')}
            </Button>
          </Flex>
        </Flex>

        <Table
          stripedRows
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
          emptyMessage={t('coupons.emptyMessage')}
        />

        <CouponDialog
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          onSuccess={() => setDialogVisible(false)}
          coupon={editingCoupon}
        />

        <ConfirmDialog
          visible={confirmDialogVisible}
          header={t('coupons.deleteConfirm.title')}
          message={t('coupons.deleteConfirm.message', { code: couponToDelete?.code })}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialogVisible(false)}
        />
      </Flex>
    </AdminLayout>
  );
};

export default CouponsPage;
