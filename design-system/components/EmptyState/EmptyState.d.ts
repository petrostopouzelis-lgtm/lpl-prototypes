import { ReactNode, CSSProperties } from 'react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

export function EmptyState(props: EmptyStateProps): JSX.Element;
