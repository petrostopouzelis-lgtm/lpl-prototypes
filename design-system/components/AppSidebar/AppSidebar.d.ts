import { ReactNode, CSSProperties } from 'react';

export interface SidebarItem {
  name: string;
  icon?: ReactNode;
  /** Orange gradient count pill, right-aligned in the row. */
  badge?: number | string;
}

export interface SidebarSection {
  /** Uppercase 11px gray group label. Omit for the first, unlabelled group. */
  label?: string;
  items?: SidebarItem[];
}

export interface AppSidebarProps {
  brandLogo?: string;
  brandName?: string;
  /** Uppercase orange sub-label under the brand name, e.g. "FOR COACHES". */
  brandSub?: string;
  sections?: SidebarSection[];
  activeItem?: string;
  onNavigate?: (name: string) => void;
  /** Organisation footer block: { initials, name, plan }. */
  org?: { initials?: string; name?: string; plan?: string };
  style?: CSSProperties;
}

export function AppSidebar(props: AppSidebarProps): JSX.Element;
