export type ColumnAlign = 'left' | 'center' | 'right';

export interface TableColumnConfig<T> {
  header: string;
  key: keyof T | string;
  width?: string;
  sortable?: boolean;
  isSearch?: boolean;
  isStatus?: boolean;
  isTypeface?: boolean;
  isType?: boolean;
  isKana?: boolean;
  isBold?: boolean;
  isHide?: boolean;
  align?: ColumnAlign;
}

export interface TableConfig {
  pagination: boolean;
  pageSize: number;
  bordered: boolean;
}
