import { IconProps, defaultIconProps } from "./IconTypes";

export function ArrowLeftIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function ArrowUpRightIcon({
  className = "h-4 w-4",
  ...props
}: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
