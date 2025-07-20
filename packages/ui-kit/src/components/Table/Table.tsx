import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Paginator, StringInput, Icon, Card } from '../index';
import { TableProps } from './table.types';
import styles from './table.module.scss';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import Overlay from '../Overlay/Overlay';

const Table = forwardRef(
  (
    {
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
      onFilterChange = () => {},
      onPageChange = () => {},
      title,
      useLocalSortAndFilter = false,
    }: TableProps,
    ref
  ) => {
    const [state, setState] = useState({
      currentPage: 1,
      rows,
      sortField,
      sortOrder,
      filters: {},
    });

    const tableRef = useRef<HTMLTableElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Expose resetPagination to parent via ref
    useImperativeHandle(ref, () => ({
      resetPagination: () => {
        setState((prev) => ({
          ...prev,
          currentPage: 1,
        }));
      },
    }));

    const handleSort = (field: string) => {
      const newSortOrder = state.sortField === field ? state.sortOrder * -1 : 1;
      setState((prev) => ({ ...prev, sortField: field, sortOrder: newSortOrder, currentPage: 1 }));

      if (!useLocalSortAndFilter) {
        onSort({ field, order: newSortOrder });
      }
    };

    const handleFilter = (value: string, field: string, matchMode: string) => {
      const newFilters = {
        ...state.filters,
        [field]: { value, matchMode },
      };
      setState((prev) => ({ ...prev, filters: newFilters, currentPage: 1 }));

      if (!useLocalSortAndFilter) {
        onFilterChange(newFilters);
      }
    };

    const applyFilters = (data: any[]) => {
      if (!useLocalSortAndFilter) return data;

      return data.filter((row) =>
        Object.entries(state.filters).every(([field, { value }]) =>
          row[field]?.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
    };

    const applySorting = (data: any[]) => {
      if (!useLocalSortAndFilter || !state.sortField) return data;

      return [...data].sort((a, b) => {
        const valA = a[state.sortField];
        const valB = b[state.sortField];
        return state.sortOrder * (valA > valB ? 1 : valA < valB ? -1 : 0);
      });
    };

    const applyPagination = (data: any[]) => {
      if (!useLocalSortAndFilter) return data;

      const start = (state.currentPage - 1) * state.rows;
      return data.slice(start, start + state.rows);
    };

    const handleRowClick = (rowData: any) => {
      if (!selectionMode) return;

      let newSelection;
      if (selectionMode === 'single') {
        newSelection = selection === rowData ? null : rowData;
      } else if (selectionMode === 'multiple') {
        if (Array.isArray(selection)) {
          const index = selection.findIndex((s) => s === rowData);
          newSelection =
            index > -1 ? selection.filter((_, i) => i !== index) : [...selection, rowData];
        } else {
          newSelection = [rowData];
        }
      }

      onSelectionChange(newSelection);
    };

    const renderHeader = useCallback(
      () => (
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                onClick={() => col.sortable && handleSort(col.field)}
                className={col.sortable ? styles.isSortable : undefined}
                title={col.sortable ? 'Click to sort' : undefined}
              >
                <span className="bts-marginRl">{col.header}</span>
                {col.sortable && renderSortIcon(col.field)}
                {col.filter && renderFilter(col)}
              </th>
            ))}
          </tr>
        </thead>
      ),
      [columns, state.sortField, state.sortOrder, state.filters]
    );

    const renderSortIcon = (field: string) => {
      if (state.sortField !== field) return <Icon icon={faSort} />;
      return state.sortOrder === 1 ? <Icon icon={faSortUp} /> : <Icon icon={faSortDown} />;
    };

    const renderFilter = useCallback(
      (col: any) => (
        <StringInput
          size="small"
          onChange={(val) => handleFilter(val, col.field, 'contains')}
          placeholder={`Filter ${col.header}`}
        />
      ),
      [handleFilter]
    );

    const isSelected = (rowData: any) => {
      if (!selection) return false;
      return Array.isArray(selection) ? selection.includes(rowData) : selection === rowData;
    };

    const renderBody = useCallback(() => {
      let data = applyFilters(value);
      data = applySorting(data);
      data = applyPagination(data);

      return (
        <tbody>
          {data.map((rowData, index) => {
            const selected = isSelected(rowData);
            return (
              <tr
                key={index}
                onClick={() => handleRowClick(rowData)}
                className={`${selected ? styles.isSelected : ''} ${
                  rowHover ? styles.withRowHover : ''
                } ${stripedRows && index % 2 === 1 ? styles.isStriped : ''}`}
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
    }, [
      value,
      state.filters,
      state.sortField,
      state.sortOrder,
      state.currentPage,
      state.rows,
      selection,
      selectionMode,
      rowHover,
      stripedRows,
    ]);

    const handlePageChange = useCallback(
      (page: number, pageSize: number) => {
        setState((prev) => ({ ...prev, currentPage: page, rows: pageSize }));

        if (!useLocalSortAndFilter) {
          onPageChange(page);
        }
      },
      [onPageChange, useLocalSortAndFilter]
    );

    return (
      <Card fullWidth header={title}>
        <div
          ref={wrapperRef}
          className={styles.tableWrapper}
          style={{
            height: scrollHeight || undefined,
            overflowY: scrollable ? 'auto' : undefined,
          }}
        >
          {isLoading && <Overlay visible={isLoading} />}

          <table ref={tableRef} className={styles.table}>
            {renderHeader()}
            {renderBody()}
          </table>

          {paginator && (
            <Paginator
              className="bts-marginTxl"
              totalItems={totalRecords}
              pageSize={state.rows}
              initialPage={state.currentPage}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
          {children}
        </div>
      </Card>
    );
  }
);

export default Table;
