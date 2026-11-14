import { CSSProperties } from 'react';

export interface HeaderNavItem {
  name: string;
  /** Present = the item renders the dropdown arrow and opens a menu panel. */
  items?: string[];
}

export interface HeaderProps {
  /** Brand mark — the blue monogram at 56px wide on desktop, 18px tall centered on mobile. */
  logo?: string;
  /** Defaults to the live site's set: Shop, Accreditation, Coaching, Resources ▾. */
  navItems?: (string | HeaderNavItem)[];
  /** Mobile drawer list. Defaults to the desktop items with dropdown children flattened in. */
  mobileNavItems?: string[];
  ctaLabel?: string;
  /** Language menu options. Defaults to the six the site ships. */
  languages?: string[];
  showLanguage?: boolean;
  /** Switches the account icon to its logged-in state. */
  loggedIn?: boolean;
  /** Relative path to `assets/icons` from the consuming page. */
  iconBase?: string;
  onNavigate?: (name: string) => void;
  onCtaClick?: () => void;
  onLoginClick?: () => void;
  onLanguageSelect?: (language: string) => void;
}

export function Header(props: HeaderProps): JSX.Element;
