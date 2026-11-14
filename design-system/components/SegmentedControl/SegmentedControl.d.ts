import { CSSProperties } from 'react';

export interface SegmentedControlProps {
  /** Plain strings, or { name, price } for the questionnaire-form variant that shows a price pill. */
  options?: (string | { name: string; price?: string })[];
  value?: string;
  onChange?: (name: string) => void;
  style?: CSSProperties;
}

export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
