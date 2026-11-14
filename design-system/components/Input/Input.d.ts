import { CSSProperties } from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: any) => void;
  style?: CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
