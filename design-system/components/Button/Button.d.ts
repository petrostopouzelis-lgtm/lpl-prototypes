import { ReactNode, CSSProperties, MouseEventHandler } from 'react';

export interface ButtonProps {
  /**
   * primary — THE blue button. There is exactly one blue button in this system: the
   * primary gradient pill. Never introduce a second blue fill.
   * secondary — white pill, primary-colored label, for the lower-emphasis action beside a primary.
   * danger — red gradient, destructive actions only.
   * submit — starts on the disabled gray gradient and turns primary on hover; the source uses
   * this for form submits that aren't valid yet.
   * ghost — white with a 1px light-gray border, for tertiary actions inside dense table rows.
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'submit' | 'ghost';
  disabled?: boolean;
  /** Stretch to the container width — how table-row and card-footer actions are rendered. */
  fullWidth?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit';
  style?: CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
