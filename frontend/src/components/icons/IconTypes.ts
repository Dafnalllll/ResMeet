import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export const defaultIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
