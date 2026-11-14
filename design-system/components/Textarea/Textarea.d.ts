import { CSSProperties } from 'react';

export interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  style?: CSSProperties;
}

export function Textarea(props: TextareaProps): JSX.Element;
