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
  Tooltip,
  PageHeader,
  Chip,
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

  const isExpired = (row: Coupon) => row.validUntil && new Date(row.validUntil) < new Date();

  const columns = [
    {
      header: t('coupons.columns.code'),
      field: 'code',
      sortable: true,
      body: (row: Coupon) => (
        <Flex align="center" spacing="xs">
          <strong>{row.code}</strong>
          {isExpired(row) && (
            <Chip label={t('coupons.expired', { defaultValue: 'Expired' })} appearance="error" />
          )}
          {row.deletedAt && (
            <Chip
              label={t('coupons.deleted', { defaultValue: 'Deleted' })}
              appearance="secondary"
            />
          )}
        </Flex>
      ),
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
      body: (row: Coupon) => (row.validFrom ? new Date(row.validFrom).toLocaleDateString() : '-'),
    },
    {
      header: t('coupons.columns.validUntil'),
      field: 'validUntil',
      sortable: true,
      body: (row: Coupon) => (row.validUntil ? new Date(row.validUntil).toLocaleDateString() : '-'),
    },
    {
      header: t('coupons.columns.uses'),
      field: 'uses',
      body: (row: Coupon) =>
        `${row.currentUses ?? 0}${row.maxUses != null ? ` / ${row.maxUses}` : ''}`,
    },
    {
      header: t('coupons.columns.actions'),
      field: 'actions',
      body: (coupon: Coupon) => (
        <Flex spacing="s">
          <Tooltip position="top" content={t('common.edit')}>
            <Button
              size="small"
              leftIconComp={Pencil}
              appearance="outline"
              onClick={() => openEditDialog(coupon)}
            />
          </Tooltip>
          <Tooltip position="top" content={t('common.delete')}>
            <Button
              size="small"
              leftIconComp={Trash2}
              appearance="outline"
              onClick={() => openDeleteDialog(coupon)}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        left={
          <Flex direction="vertical" spacing="xs">
            <Heading level="h1">{t('coupons.title')}</Heading>
            <Heading level="h4" appearance="light">
              {t('coupons.subtitle')}
            </Heading>
          </Flex>
        }
        right={
          <Flex align="center" spacing="s">
            <StringInput
              placeholder={t('coupons.searchPlaceholder')}
              value={searchInput}
              className={styles.couponsPageSearch}
              onChange={(val) => {
                const v = String(val ?? '');
                setSearchInput(v);
                if (!v.length) handleSearch('');
              }}
              iconRight={Search}
              withIconBackground
              onIconClick={() => handleSearch(searchInput)}
            />
            <Flex align="center" spacing="xs">
              <Toggle checked={includeDeleted} onChange={(v) => setIncludeDeleted(!!v)} />
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {t('coupons.showDeleted')}
              </span>
            </Flex>
            <Button
              onClick={openAddDialog}
              leftIconComp={Plus}
              className={styles.couponsPageAddBtn}
            >
              {t('coupons.addButton')}
            </Button>
          </Flex>
        }
      />

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
    </AdminLayout>
  );
};

export default CouponsPage;
