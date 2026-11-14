import { CSSProperties } from 'react';

export interface StepperProps {
  steps?: string[];
  /** Zero-based index of the current step; earlier steps render as done. */
  current?: number;
  style?: CSSProperties;
}

export function Stepper(props: StepperProps): JSX.Element;
