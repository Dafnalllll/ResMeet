import { IconProps, defaultIconProps } from "./IconTypes";

export function ClockIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function CalendarIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3v3" />
      <path d="M16 3v3" />
    </svg>
  );
}

export function HashIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M9.5 4 8 20" />
      <path d="M16 4l-1.5 16" />
      <path d="M4.5 9h15" />
      <path d="M3.8 15h15" />
    </svg>
  );
}

export function TagIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12.6 3.4H19a1.6 1.6 0 0 1 1.6 1.6v6.4a2 2 0 0 1-.6 1.4l-7 7a1.6 1.6 0 0 1-2.3 0l-6.5-6.5a1.6 1.6 0 0 1 0-2.3l7-7a2 2 0 0 1 1.4-.6Z" />
      <path d="M16 8h.01" />
    </svg>
  );
}

export function FolderIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3.2a2 2 0 0 1 1.5.7l1 1.2H18a2.5 2.5 0 0 1 2.5 2.5v6.1A2.5 2.5 0 0 1 18 18H6a2.5 2.5 0 0 1-2.5-2.5V7.5Z" />
    </svg>
  );
}

export function WaveformIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 10v4" />
      <path d="M8 7v10" />
      <path d="M12 4v16" />
      <path d="M16 7v10" />
      <path d="M20 10v4" />
    </svg>
  );
}

export function QuoteIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M8.5 6C6 7.2 4.6 9.3 4.6 12.1c0 2.5 1.4 4.3 3.6 4.3 1.8 0 3-1.2 3-2.9 0-1.6-1-2.7-2.5-2.7-.3 0-.6 0-.8.1.3-1.3 1.3-2.4 2.7-3.1L8.5 6Z" />
      <path d="M17.4 6c-2.5 1.2-3.9 3.3-3.9 6.1 0 2.5 1.4 4.3 3.6 4.3 1.8 0 3-1.2 3-2.9 0-1.6-1-2.7-2.5-2.7-.3 0-.6 0-.8.1.3-1.3 1.3-2.4 2.7-3.1L17.4 6Z" />
    </svg>
  );
}
