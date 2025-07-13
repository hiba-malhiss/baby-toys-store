export type Column<T> = {
  field: keyof T;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  body?: (row: T) => React.ReactNode;
};

export type FilterMetadata = {
  value: string;
  matchMode: string;
};

export type TableProps<T> = {
  value: T[];
  columns: Column<T>[];
  paginator?: boolean;
  rows?: number;
  totalRecords?: number;
  selectionMode?: 'single' | 'multiple' | null;
  selection?: T | T[] | null;
  onSelectionChange?: (selection: T | T[] | null) => void;
  sortField?: keyof T | null;
  sortOrder?: 1 | -1;
  onSort?: (params: { field: keyof T; order: 1 | -1 }) => void;
  onFilterChange?: (filters: Record<string, FilterMetadata>) => void;
  scrollable?: boolean;
  scrollHeight?: string | null;
  rowHover?: boolean;
  isLoading?: boolean;
  stripedRows?: boolean;
  children?: React.ReactNode;
  useLocalSortAndFilter?: boolean;
};
