export interface SocialIconProps {
  /** The `state=Default` SVG. */
  defaultSrc: string;
  /** The `state=hover` SVG — every social icon in the library ships as a pair. */
  hoverSrc?: string;
  label?: string;
  href?: string;
  /** 20px on mobile, 24–28px on desktop. */
  size?: number;
}

export function SocialIcon(props: SocialIconProps): JSX.Element;
