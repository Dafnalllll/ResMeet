"use client";

import type { ReactNode } from "react";

import { CheckIcon, CopyIcon } from "@/components/icons/ActionIcons";
import { useClipboard } from "@/hooks/useClipboard";

interface MetadataRowProps {
  label: string;
  icon: ReactNode;
  /** Nilai teks mentah, juga dipakai saat menyalin. */
  value: string;
  /** Tampilan kustom bila nilainya bukan teks biasa. */
  children?: ReactNode;
  mono?: boolean;
  copyable?: boolean;
}

export default function MetadataRow({
  label,
  icon,
  value,
  children,
  mono = false,
  copyable = false,
}: MetadataRowProps) {
  const { copiedKey, copy } = useClipboard();
  const isCopied = copiedKey === label;

  return (
    <div className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-300 hover:bg-(--rsm-accent-soft)]">
      <span className="mt-0.5 shrink-0 text-(--rsm-ink-mute)] transition-colors duration-300 group-hover:text-(--rsm-accent)]">
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--rsm-ink-mute)]">
          {label}
        </dt>
        <dd
          className={`mt-1 wrap-break-word text-sm text-(--rsm-ink)] ${
            mono ? "font-mono text-xs" : ""
          }`}
        >
          {children ?? value}
        </dd>
      </div>

      {copyable && (
        <button
          type="button"
          onClick={() => copy(value, label)}
          aria-label={`Salin ${label}`}
          className={`rsm-action shrink-0 rounded-lg border border-transparent p-1.5 transition-all duration-300 hover:border-(--rsm-line)] hover:bg-(--rsm-card)] ${
            isCopied
              ? "text-(--rsm-ok)]"
              : "text-(--rsm-ink-mute)] hover:text-(--rsm-ink)]"
          }`}
        >
          {isCopied ? (
            <CheckIcon className="h-3.5 w-3.5" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      <span className="sr-only" role="status" aria-live="polite">
        {isCopied ? `${label} tersalin` : ""}
      </span>
    </div>
  );
}
