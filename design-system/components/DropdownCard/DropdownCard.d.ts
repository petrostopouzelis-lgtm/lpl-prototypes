import { ReactNode, CSSProperties } from 'react';

export interface DropdownCardProps {
  title?: string;
  /** Cards start expanded in the source; the chevron rotates 180° when collapsed. */
  defaultOpen?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

export function DropdownCard(props: DropdownCardProps): JSX.Element;
