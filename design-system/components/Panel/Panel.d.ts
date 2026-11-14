import { ReactNode, CSSProperties } from 'react';

export interface PanelProps {
  /** Panel heading — 20px semibold Manrope in text-blue. */
  title?: string;
  /** Right-aligned node in the header band, usually a Button or a "View all" link. */
  action?: ReactNode;
  /** Centered footer node, usually a "View all" link. */
  footer?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Panel(props: PanelProps): JSX.Element;
