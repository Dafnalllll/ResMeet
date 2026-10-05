"use client";

import type { ButtonProps, ButtonType } from "./ButtonTypes";

export default function Button({
  label,
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
  type = "button",
  children,
}: ButtonProps) {
  const variants: Record<ButtonType, string> = {
    primary: "bg-(--rsm-accent) text-white hover:bg-(--rsm-accent-ink)",
    secondary: "bg-slate-600 text-white hover:bg-slate-700",
    success: "bg-green-700 text-white hover:bg-green-800",
    danger: "bg-red-700 text-white hover:bg-red-800",
    outline:
      "border border-(--rsm-line-strong) bg-(--rsm-card) text-(--rsm-ink-soft) hover:bg-(--rsm-paper)",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
      {label}
    </button>
  );
}
