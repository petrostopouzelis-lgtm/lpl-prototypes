import { CSSProperties } from 'react';

export interface TabsProps {
  /** Plain strings, or { name, count } to show the count pill. */
  tabs?: (string | { name: string; count?: number })[];
  active?: string;
  onChange?: (name: string) => void;
  style?: CSSProperties;
}

export function Tabs(props: TabsProps): JSX.Element;
