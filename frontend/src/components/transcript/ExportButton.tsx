"use client";

import type { ReactNode } from "react";

type ExportVariant = "solid" | "ghost";

interface ExportButtonProps {
  label: string;
  hint: string;
  icon: ReactNode;
  variant?: ExportVariant;
  disabled?: boolean;
  onClick: () => void;
}

const VARIANT_STYLES: Record<ExportVariant, string> = {
  solid:
    "border-transparent bg-(--rsm-accent)] text-[#fffdf8] hover:bg-(--rsm-accent-ink)] hover:shadow-[0_14px_28px_-16px_var(--rsm-accent)]",
  ghost:
    "border-(--rsm-line)] bg-(--rsm-card)] text-(--rsm-ink)] hover:border-(--rsm-line-strong)] hover:shadow-[0_14px_28px_-20px_rgba(25,23,18,0.6)]",
};

export default function ExportButton({
  label,
  hint,
  icon,
  variant = "ghost",
  disabled = false,
  onClick,
}: ExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rsm-action group flex min-w-44 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 ${VARIANT_STYLES[variant]}`}
    >
      <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
        {icon}
      </span>

      <span className="flex flex-col">
        <span className="text-sm leading-tight font-medium">{label}</span>
        <span className="mt-0.5 font-mono text-[10px] tracking-widest opacity-70">
          {hint}
        </span>
      </span>
    </button>
  );
}
