import { CSSProperties } from 'react';

export interface ProgressBarProps {
  value?: number;
  max?: number;
  /** Caption to the right of the track, e.g. "12/15". */
  label?: string;
  style?: CSSProperties;
}

export function ProgressBar(props: ProgressBarProps): JSX.Element;
