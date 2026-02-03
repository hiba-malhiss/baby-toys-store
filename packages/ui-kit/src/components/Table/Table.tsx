import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  Paginator,
  StringInput,
  Icon,
  Card,
  Image,
  Button,
  Popover,
  Flex,
  Select,
} from '../index';
import { TableProps, Column } from './table.types';
import styles from './table.module.scss';
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronDown,
  Filter,
  X,
} from 'lucide-react';
import Overlay from '../Overlay/Overlay';

interface TableRef {
  resetPagination: () => void;
  clearFilters: () => void;
}

type FilterItem = {
  value: string;
  matchMode: string;
};

type FilterState = Record<string, FilterItem>;

type DraftFilterState = Record<
  string,
  {
    value: string;
    matchMode: string;
  }
>;

const DEFAULT_MATCH_MODE = 'contains';

const MATCH_MODE_OPTIONS = [
  { label: 'Contains', value: 'contains' },
  { label: 'Starts With', value: 'startsWith' },
  { label: 'Ends With', value: 'endsWith' },
  { label: 'Equals', value: 'equals' },
  { label: 'Not Equals', value: 'notEquals' },
];

const Table = forwardRef<TableRef, TableProps<any>>(
  (
    {
      value = [],
      columns = [],
      paginator = false,
      rows = 0,
      totalRecords = 0,
      selectionMode = null,
      selection = null,
      onSelectionChange = () => {
      },
      sortField = null,
      sortOrder = 1,
      onSort = () => {
      },
      scrollable = false,
      scrollHeight = null,
      rowHover = false,
      isLoading = false,
      stripedRows = false,
      emptyMessage,
      children,
      onFilterChange = () => {
      },
      onPageChange = () => {
      },
      title,
      useLocalSortAndFilter = false,
      withoutCard = false,
      expandedRows = {},
      onRowExpand,
      onRowCollapse,
      rowExpansionTemplate,
    },
    ref
  ) => {
    const [state, setState] = useState({
      currentPage: 1,
      rows,
      sortField,
      sortOrder,
      filters: {} as FilterState,
    });

    const [localExpandedRows, setLocalExpandedRows] = useState<Record<string, boolean>>({});
    const [filterOverlayVisible, setFilterOverlayVisible] = useState<string | null>(null);
    const [draftFilters, setDraftFilters] = useState<DraftFilterState>({});

    const tableRef = useRef<HTMLTableElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // ✅ anchor elements for popover positioning (no ref needed on Button)
    const filterAnchorRefs = useRef<Record<string, HTMLSpanElement | null>>({});

    const expandedRowsState = onRowExpand ? expandedRows : localExpandedRows;

    useImperativeHandle(ref, () => ({
      resetPagination: () => {
        setState((prev) => ({ ...prev, currentPage: 1 }));
      },
      clearFilters: () => {
        setState((prev) => ({ ...prev, filters: {}, currentPage: 1 }));
        setDraftFilters({});
        setFilterOverlayVisible(null);
        if(!useLocalSortAndFilter) onFilterChange({});
      },
    }));

    /* ================== Sorting ================== */

    const handleSort = (field: string) => {
      const newSortOrder = state.sortField === field ? state.sortOrder * -1 : 1;

      setState((prev) => ({
        ...prev,
        sortField: field,
        sortOrder: newSortOrder,
        currentPage: 1,
      }));

      if(!useLocalSortAndFilter) {
        onSort({ field, order: newSortOrder });
      }
    };

    const renderSortIcon = (field: string) => {
      if(state.sortField !== field) return <Icon icon={ArrowUpDown} size={16}/>;
      return state.sortOrder === 1 ? (
        <Icon icon={ArrowUp} size={16}/>
      ) : (
        <Icon icon={ArrowDown} size={16}/>
      );
    };

    /* ================== Filtering ================== */

    const closeFilterMenu = () => setFilterOverlayVisible(null);

    // ✅ Toggle behavior: click the same icon again -> close
    const toggleFilterMenu = (field: string) => {
      setFilterOverlayVisible((prev) => {
        if(prev === field) return null;

        const committed = state.filters[field];
        setDraftFilters((draftPrev) => ({
          ...draftPrev,
          [field]: {
            value: committed?.value ?? '',
            matchMode: committed?.matchMode ?? DEFAULT_MATCH_MODE,
          },
        }));

        return field;
      });
    };

    const commitFilter = (field: string, filter?: FilterItem) => {
      const next = { ...state.filters };

      if(!filter || !filter.value.trim()) {
        delete next[field];
      } else {
        next[field] = filter;
      }

      setState((prev) => ({ ...prev, filters: next, currentPage: 1 }));
      if(!useLocalSortAndFilter) onFilterChange(next);
    };

    const matchFilter = (cellValue: any, filterValue: string, matchMode: string) => {
      if(!filterValue) return true;

      const cell = String(cellValue ?? '').toLowerCase();
      const q = filterValue.toLowerCase();

      switch(matchMode) {
        case 'startsWith':
          return cell.startsWith(q);
        case 'endsWith':
          return cell.endsWith(q);
        case 'equals':
          return cell === q;
        case 'notEquals':
          return cell !== q;
        default:
          return cell.includes(q);
      }
    };

    const applyFilters = (data: any[]) => {
      if(!useLocalSortAndFilter || Object.keys(state.filters).length === 0) return data;

      return data.filter((row) =>
        Object.entries(state.filters).every(([field, filter]) =>
          matchFilter(row[field], filter.value, filter.matchMode)
        )
      );
    };

    /* ================== Local sort + pagination ================== */

    const applySorting = (data: any[]) => {
      if(!useLocalSortAndFilter || !state.sortField) return data;

      const field = state.sortField as string;

      return [...data].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if(aVal === bVal) return 0;
        return state.sortOrder * (aVal > bVal ? 1 : -1);
      });
    };

    const applyPagination = (data: any[]) => {
      if(!useLocalSortAndFilter) return data;
      const start = (state.currentPage - 1) * state.rows;
      return data.slice(start, start + state.rows);
    };

    /* ================== Selection ================== */

    const handleRowClick = (rowData: any) => {
      if(!selectionMode) return;

      let newSelection: any = null;

      if(selectionMode === 'single') {
        newSelection = selection === rowData ? null : rowData;
      } else if(selectionMode === 'multiple') {
        if(Array.isArray(selection)) {
          const idx = selection.findIndex((s) => s === rowData);
          newSelection = idx > -1 ? selection.filter((_, i) => i !== idx) : [...selection, rowData];
        } else {
          newSelection = [rowData];
        }
      }

      onSelectionChange(newSelection);
    };

    const isSelected = (rowData: any) => {
      if(!selection) return false;
      return Array.isArray(selection) ? selection.includes(rowData) : selection === rowData;
    };

    /* ================== Expansion ================== */

    const toggleRowExpansion = (rowData: any, index: number) => {
      const rowKey = rowData.id || index;
      const isExpanded = expandedRowsState[rowKey];

      if(onRowExpand && onRowCollapse) {
        if(isExpanded) onRowCollapse({ originalEvent: null, data: rowData });
        else onRowExpand({ originalEvent: null, data: rowData });
        return;
      }

      setLocalExpandedRows((prev) => ({ ...prev, [rowKey]: !isExpanded }));
    };

    /* ================== Filter UI ================== */

    const renderFilterMenu = (col: Column<any>) => {
      const field = col.field as string;
      const anchor = filterAnchorRefs.current[field];
      if(!anchor) return null;

      const draft = draftFilters[field] ?? {
        value: '',
        matchMode: DEFAULT_MATCH_MODE,
      };

      const apply = () => {
        commitFilter(field, { value: draft.value, matchMode: draft.matchMode });
        closeFilterMenu();
      };

      const clear = () => {
        setDraftFilters((prev) => ({
          ...prev,
          [field]: { value: '', matchMode: DEFAULT_MATCH_MODE },
        }));
        commitFilter(field, undefined);
        closeFilterMenu();
      };

      return (
        <Popover
          open={filterOverlayVisible === field}
          targetRef={{ current: anchor } as React.RefObject<HTMLElement>}
          onClose={closeFilterMenu}
          position="bottom"
          withArrow
          size="small"
        >
          <div
            className={styles.filterMenu}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Flex justify="between" align="center" className={styles.filterMenuHeader}>
              <span className={styles.filterMenuTitle}>Filter by {col.header}</span>

              <Button
                type="button"
                appearance="link"
                size="xsmall"
                withoutPadding
                className={styles.closeButton}
                onClick={closeFilterMenu}
              >
                <Icon icon={X} size={16}/>
              </Button>
            </Flex>

            <div className={styles.filterMenuContent}>
              <StringInput
                size="small"
                value={draft.value}
                onChange={(val) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    [field]: { ...draft, value: String(val ?? '') },
                  }))
                }
                placeholder={`Filter ${col.header}`}
              />

              {/* ✅ use your Select component */}
              <Select
                value={draft.matchMode}
                options={MATCH_MODE_OPTIONS}
                onChange={(v) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    [field]: { ...draft, matchMode: String(v ?? DEFAULT_MATCH_MODE) },
                  }))
                }
              />

              <Flex spacing="s" align="end">
                <Button size="small" appearance="outline" onClick={clear}>
                  Clear
                </Button>
                <Button size="small" onClick={apply} isDisabled={!draft.value.trim()}>
                  Apply
                </Button>
              </Flex>
            </div>
          </div>
        </Popover>
      );
    };

    const renderFilterButton = (col: Column<any>) => {
      const field = col.field as string;
      const hasFilter = Boolean(state.filters[field]?.value?.trim());

      return (
        <>
          <span ref={(el) => (filterAnchorRefs.current[field] = el)}>
            <Button
              type="button"
              appearance="link"
              size="xsmall"
              withoutPadding
              className={styles.filterButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleFilterMenu(field);
              }}
              aria-label={`Filter ${String(col.header ?? field)}`}
            >
              <Icon icon={Filter} badge={hasFilter ? '1' : undefined}/>
            </Button>
          </span>

          {filterOverlayVisible === field && renderFilterMenu(col)}
        </>
      );
    };

    /* ================== Header ================== */

    const renderHeader = useCallback(
      () => (
        <thead>
        <tr>
          {rowExpansionTemplate && <th style={{ width: '50px' }}></th>}

          {columns.map((col) => {
            const field = col.field as string;

            return (
              <th
                key={field}
                className={col.sortable ? styles.isSortable : undefined}
                title={col.sortable ? 'Click to sort' : undefined}
                onClick={(e) => {
                  const target = e.target as Element;

                  // ✅ prevent sorting if clicking filter button or inside menu
                  if(target.closest(`.${styles.filterButton}`)) return;
                  if(target.closest(`.${styles.filterMenu}`)) return;

                  if(col.sortable) handleSort(field);
                }}
              >
                <Flex align="center" justify="between" fullWidth>
                  <span>{col.header}</span>

                  <Flex align="center" spacing="xs">
                    {col.sortable && renderSortIcon(field)}
                    {col.filter && renderFilterButton(col)}
                  </Flex>
                </Flex>
              </th>
            );
          })}
        </tr>
        </thead>
      ),
      [columns, state.sortField, state.sortOrder, state.filters, filterOverlayVisible, draftFilters]
    );

    /* ================== Body ================== */

    const renderEmptyMessage = useCallback(
      () => (
        <tbody>
        <tr>
          <td
            colSpan={columns.length + (rowExpansionTemplate ? 1 : 0)}
            className={styles.emptyMessage}
          >
            {typeof emptyMessage === 'string' ? (
              <div className={styles.emptyMessageContent}>{emptyMessage || 'No records found'}</div>
            ) : (
              emptyMessage || <div className={styles.emptyMessageContent}>No records found</div>
            )}
          </td>
        </tr>
        </tbody>
      ),
      [columns.length, emptyMessage, rowExpansionTemplate]
    );

    const renderExpansionContent = (rowData: any, index: number) => {
      if(!rowExpansionTemplate) return null;

      const rowKey = rowData.id || index;
      if(!expandedRowsState[rowKey]) return null;

      return (
        <tr className={styles.expandedRow}>
          <td colSpan={columns.length + 1}>
            {typeof rowExpansionTemplate === 'function' ? rowExpansionTemplate(rowData) : rowExpansionTemplate}
          </td>
        </tr>
      );
    };

    const renderBody = useCallback(() => {
      let data = applyFilters(value);
      data = applySorting(data);

      if(data.length === 0) return renderEmptyMessage();

      data = applyPagination(data);

      return (
        <tbody>
        {data.map((rowData, index) => {
          const selected = isSelected(rowData);
          const rowKey = rowData.id || index;
          const isExpanded = expandedRowsState[rowKey];

          return (
            <React.Fragment key={rowKey}>
              <tr
                onClick={() => handleRowClick(rowData)}
                className={`
                    ${selected ? styles.isSelected : ''} 
                    ${rowHover ? styles.withRowHover : ''} 
                    ${stripedRows && index % 2 === 1 ? styles.isStriped : ''}
                    ${isExpanded ? styles.expandedParent : ''}
                  `}
                style={{ cursor: selectionMode ? 'pointer' : 'default' }}
              >
                {rowExpansionTemplate && (
                  <td className={styles.expandCell}>
                    <Button
                      type="button"
                      appearance="link"
                      size="xsmall"
                      withoutPadding
                      className={styles.expandButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRowExpansion(rowData, index);
                      }}
                      aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                    >
                      <Icon icon={isExpanded ? ChevronDown : ChevronRight}/>
                    </Button>
                  </td>
                )}

                {columns.map((col) => (
                  <td key={col.field as string} data-label={col.header}>
                    {col.body ? (
                      col.body(rowData)
                    ) : col.type === 'image' ? (
                      <div className={styles.cellImageWrapper}>
                        {rowData[col.field] ? (
                          <Image src={rowData[col.field]} alt={rowData.name || 'image'} className={styles.cellImage}/>
                        ) : (
                          <div className={styles.cellPlaceholder}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#999"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      rowData[col.field]
                    )}
                  </td>
                ))}
              </tr>

              {renderExpansionContent(rowData, index)}
            </React.Fragment>
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
      expandedRowsState,
      rowExpansionTemplate,
    ]);

    /* ================== Pagination handler ================== */

    const handlePageChange = useCallback(
      (page: number, pageSize: number) => {
        setState((prev) => ({ ...prev, currentPage: page, rows: pageSize }));
        if(!useLocalSortAndFilter) onPageChange(page);
      },
      [onPageChange, useLocalSortAndFilter]
    );

    /* ================== Close on Escape ================== */

    useEffect(() => {
      if(!filterOverlayVisible) return;

      const onKeyDown = (e: KeyboardEvent) => {
        if(e.key === 'Escape') closeFilterMenu();
      };

      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [filterOverlayVisible]);

    /* ================== Render ================== */

    const TableInner = (
      <>
        <div
          ref={wrapperRef}
          className={styles.tableWrapper}
          style={{
            height: scrollHeight || undefined,
            overflowY: scrollable ? 'auto' : undefined,
          }}
        >
          {isLoading && <Overlay visible={isLoading}/>}

          <table ref={tableRef} className={styles.table}>
            {renderHeader()}
            {renderBody()}
          </table>
        </div>

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
      </>
    );

    if(withoutCard) return TableInner as any;

    return (
      <Card fullWidth header={title}>
        {TableInner}
      </Card>
    );
  }
);

export default Table;
