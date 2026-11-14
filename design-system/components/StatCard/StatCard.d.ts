import { ReactNode, CSSProperties } from 'react';

export interface StatCardProps {
  /** 20px semibold Manrope in text-blue, above the number. */
  label?: string;
  /** The 30px bold figure. */
  value?: string | number;
  /** Small caption under the value, e.g. "+12 added this month". */
  sub?: string;
  /** up = green, warn = orange, omit = gray. */
  subTone?: 'up' | 'warn';
  /** 32px SVG, stroked with the statIconGrad gradient in the source. */
  icon?: ReactNode;
  /** Drop the card surface so stats sit directly on the page with divider rules between them. */
  plain?: boolean;
  style?: CSSProperties;
}

export function StatCard(props: StatCardProps): JSX.Element;
