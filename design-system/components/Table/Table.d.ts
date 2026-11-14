import { ReactNode } from 'react';

export interface TableProps {
  columns: string[];
  rows: any[][];
  renderCell?: (row: any[], column: string) => ReactNode;
}

export function Table(props: TableProps): JSX.Element;
