import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface SimpleTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  actions?: (item: T, index?: number) => ReactNode;
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
  skeletonRows?: number;
}
