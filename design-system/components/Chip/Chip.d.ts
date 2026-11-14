import { ReactNode, CSSProperties } from 'react';

export interface ChipProps {
  active?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Chip(props: ChipProps): JSX.Element;
