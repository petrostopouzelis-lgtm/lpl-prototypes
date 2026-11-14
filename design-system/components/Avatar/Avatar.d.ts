import { CSSProperties } from 'react';

export interface AvatarProps {
  /** 1–2 letter initials. The platform never shows photos — initials on a gradient only. */
  initials?: string;
  /** sm = 34px (table rows, avatar stacks), md = 40px (sidebar org), lg = 64px (profile headers). */
  size?: 'sm' | 'md' | 'lg';
  /** Override the fill, e.g. a group's own gradient for group avatars. */
  gradient?: string;
  style?: CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
