import { CSSProperties } from 'react';

export interface TopbarMenuItem {
  name: string;
  /** Orange count pill (e.g. unread notifications). */
  badge?: number | string;
  /** Renders in secondary orange — used for Log out. */
  danger?: boolean;
}

export interface AppTopbarProps {
  /** 28px bold Manrope in text-blue. */
  title?: string;
  /** 14px gray line under the title, e.g. "Welcome back, Elena." */
  subtitle?: string;
  searchPlaceholder?: string;
  profileName?: string;
  profileInitials?: string;
  /** Orange dot on the profile button when notifications are unread. */
  unread?: boolean;
  menuItems?: TopbarMenuItem[];
  /** Pass to show the burger (mobile / collapsed sidebar). */
  onBurgerClick?: () => void;
  onMenuSelect?: (name: string) => void;
  style?: CSSProperties;
}

export function AppTopbar(props: AppTopbarProps): JSX.Element;
