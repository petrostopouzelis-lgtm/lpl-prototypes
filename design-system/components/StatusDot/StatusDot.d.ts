import { CSSProperties } from 'react';

export interface StatusDotProps {
  /** primary = in progress, green = complete, yellow = attention, red = failed/overdue. */
  tone?: 'primary' | 'green' | 'red' | 'yellow';
  label?: string;
  style?: CSSProperties;
}

export function StatusDot(props: StatusDotProps): JSX.Element;
