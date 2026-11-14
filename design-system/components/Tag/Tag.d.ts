import { ReactNode, CSSProperties } from 'react';

export interface TagProps {
  color?: 'primary' | 'secondary' | 'yellow' | 'green' | 'magenta' | 'purple' | 'red';
  children?: ReactNode;
  style?: CSSProperties;
}

export function Tag(props: TagProps): JSX.Element;
