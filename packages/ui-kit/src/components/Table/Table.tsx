import React, { useState, useRef } from 'react';
import { Paginator, StringInput, Icon } from '../index';
import { TableProps } from './table.types';
import styles from './table.module.scss';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

const Table = ({
  value = [],
  columns = [],
  paginator = false,
  rows = 0,
  totalRecords = 0,
  selectionMode = null,
  selection = null,
  onSelectionChange = () => {},
  sortField = null,
  sortOrder = 1,
  onSort = () => {},
  scrollable = false,
  scrollHeight = null,
  rowHover = false,
  isLoading = false,
  stripedRows = false,
  children,
}: TableProps) => {
  const [state, setState] = useState({
    currentPage: 1,
    rows,
    sortField,
    sortOrder,
    selection,
    filters: {},
  });

  const tableRef = useRef<HTMLTableElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: string) => {
    const newSortOrder = state.sortField === field ? state.sortOrder * -1 : 1;
    setState((prev) => ({ ...prev, sortField: field, sortOrder: newSortOrder, currentPage: 1 }));
    onSort({ field, order: newSortOrder });
  };

  const handleRowClick = (rowData: any) => {
    if (!selectionMode) return;

    let newSelection;
    if (selectionMode === 'single') {
      newSelection = state.selection === rowData ? null : rowData;
    } else if (selectionMode === 'multiple') {
      if (Array.isArray(state.selection)) {
        const selectedIndex = state.selection.findIndex((s) => s === rowData);
        if (selectedIndex > -1) {
          newSelection = [...state.selection];
          newSelection.splice(selectedIndex, 1);
        } else {
          newSelection = [...state.selection, rowData];
        }
      } else {
        newSelection = [rowData];
      }
    }

    setState((prev) => ({ ...prev, selection: newSelection }));
    onSelectionChange(newSelection);
  };

  const filter = (value: string, field: string, matchMode: string) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [field]: { value, matchMode },
      },
      currentPage: 1,
    }));
  };

  const applyFilters = (data: any[]) => {
    return data.filter((row) =>
      Object.entries(state.filters).every(([field, { value }]) =>
        row[field]?.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const applySorting = (data: any[]) => {
    if (!state.sortField) return data;
    return [...data].sort((a, b) => {
      const valA = a[state.sortField];
      const valB = b[state.sortField];
      return state.sortOrder * (valA > valB ? 1 : valA < valB ? -1 : 0);
    });
  };

  const applyPagination = (data: any[]) => {
    const start = (state.currentPage - 1) * state.rows;
    return data.slice(start, start + state.rows);
  };

  const renderHeader = () => (
    <thead>
      <tr>
        {columns.map((col) => (
          <th
            key={col.field}
            onClick={() => col.sortable && handleSort(col.field)}
            className={col.sortable ? styles.sortable : undefined}
            title={col.sortable ? 'Click to sort' : undefined}
          >
            <span>{col.header}</span>
            {col.sortable && renderSortIcon(col.field)}
            {col.filter && renderFilter(col)}
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderSortIcon = (field: string) => {
    if (state.sortField !== field) return <Icon icon={faSort} className={styles.sortIcon} />;
    return state.sortOrder === 1 ? (
      <Icon icon={faSortUp} className={styles.sortIcon} />
    ) : (
      <Icon icon={faSortDown} className={styles.sortIcon} />
    );
  };

  const renderFilter = (column: any) => (
    <StringInput
      size="small"
      onChange={(value) => filter(value, column.field, 'contains')}
      placeholder={`Filter ${column.header}`}
    />
  );

  const isSelected = (rowData: any) => {
    if (!state.selection) return false;
    if (Array.isArray(state.selection)) {
      return state.selection.some((s) => s === rowData);
    }
    return state.selection === rowData;
  };

  const renderBody = () => {
    let data = applyFilters(value);
    data = applySorting(data);
    if (paginator) data = applyPagination(data);

    return (
      <tbody>
        {data.map((rowData, index) => {
          const selected = isSelected(rowData);
          return (
            <tr
              key={index}
              onClick={() => handleRowClick(rowData)}
              className={`${selected ? styles.selected : ''} ${
                rowHover ? styles.rowHover : ''
              } ${stripedRows && index % 2 === 1 ? styles.striped : ''}`}
              style={{ cursor: selectionMode ? 'pointer' : 'default' }}
            >
              {columns.map((col) => (
                <td key={col.field} data-label={col.header}>
                  {col.body ? col.body(rowData) : rowData[col.field]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setState((prev) => ({ ...prev, currentPage: page, rows: pageSize }));
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.tableWrapper}
      style={{
        height: scrollHeight || undefined,
        overflowY: scrollable ? 'auto' : undefined,
      }}
    >
      {isLoading && <div className={styles.loadingOverlay}>Loading...</div>}

      <table ref={tableRef} className={styles.table}>
        {renderHeader()}
        {renderBody()}
      </table>

      {paginator && (
        <div className={styles.paginatorWrapper}>
          <Paginator
            totalItems={totalRecords}
            pageSize={state.rows}
            initialPage={state.currentPage}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      )}

      {children}
    </div>
  );
};

export default Table;
