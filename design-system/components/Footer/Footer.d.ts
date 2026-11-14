import { CSSProperties } from 'react';

export interface FooterColumn {
  heading: string;
  links?: string[];
}

export interface FooterSocial {
  label: string;
  /** `state=Default` SVG — rendered white via a brightness/invert filter is NOT used here; pass the white-ready pair. */
  defaultSrc: string;
  hoverSrc?: string;
  href?: string;
}

export interface FooterProps {
  /** Brand logo — automatically knocked out to white with `brightness(0) invert(1)`. */
  logo?: string;
  /** Short brand line under the logo. */
  tagline?: string;
  social?: FooterSocial[];
  /** Three link columns in the source layout (1.4fr brand / 1fr / 1fr / 1fr / 1.2fr impressum). */
  columns?: FooterColumn[];
  /** Registered-address block in the last column: { title, lines }. */
  impressum?: { title?: string; lines?: string[] };
  /** Inline legal links in the bottom bar, left of the copyright. */
  legalLinks?: string[];
  copyright?: string;
  onNavigate?: (label: string) => void;
}

export function Footer(props: FooterProps): JSX.Element;
