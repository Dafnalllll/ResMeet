import { IconProps, defaultIconProps } from "./IconTypes";

export function DownloadIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function CopyIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function AlertIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function SparklesIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3.5l1.6 4.4 4.4 1.6-4.4 1.6L12 15.5l-1.6-4.4L6 9.5l4.4-1.6L12 3.5Z" />
      <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
    </svg>
  );
}

export function FileTextIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7l-4-4Z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

export function FilePdfIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7l-4-4Z" />
      <path d="M14 3v4h4" />
      <path d="M9 17v-4h1.5a1.25 1.25 0 0 1 0 2.5H9" />
      <path d="M14 17v-4h2" />
      <path d="M14 15h1.5" />
    </svg>
  );
}

export function FileDocxIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7l-4-4Z" />
      <path d="M14 3v4h4" />
      <path d="M9 17v-4" />
      <path d="m9 13 1.6 4 1.6-4" />
      <path d="M15.5 13H17" />
      <path d="M16.2 13v4" />
    </svg>
  );
}

export function SearchIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function TrashIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function PlayIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

export function PauseIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="5" y="3" width="4" height="18" rx="1" />
      <rect x="15" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}
