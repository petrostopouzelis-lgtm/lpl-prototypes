import { ReactNode, CSSProperties } from 'react';

export interface CardProps {
  /** base = white surface; primary/secondary = full gradient card with white text (promos, offers). */
  variant?: 'base' | 'primary' | 'secondary';
  /** White card that turns into the primary gradient with inverted icon/text colors on hover. */
  hoverable?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
