"use client";

import {
  AlertIcon,
  SearchIcon,
  SparklesIcon,
} from "@/components/icons/ActionIcons";
import { QuoteIcon } from "@/components/icons/MetaIcons";
import Button from "@/components/button/Button";

export type EmptyVariant = "no-recordings" | "no-match" | "error";

const TITLES: Record<EmptyVariant, string> = {
  "no-recordings": "Belum ada rekaman rapat",
  "no-match": "Tidak ada rekaman yang cocok",
  error: "Gagal memuat daftar rekaman",
};

interface RecordingsEmptyStateProps {
  variant: EmptyVariant;
  query?: string;
  onReset?: () => void;
  onRetry?: () => void;
}

export default function RecordingsEmptyState({
  variant,
  query,
  onReset,
  onRetry,
}: RecordingsEmptyStateProps) {
  const isNoMatch = variant === "no-match";
  const isError = variant === "error";

  const description = isNoMatch
    ? `Tidak ada judul atau nama berkas yang mengandung “${query ?? ""}”. Coba kata kunci lain.`
    : isError
      ? "Terjadi kendala saat menghubungi server. Periksa koneksi lalu coba lagi."
      : "Rekaman yang kamu unggah akan muncul di sini beserta status dan transkripnya.";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-(--rsm-line-strong)] bg-(--rsm-card)] px-6 py-12 text-center animate-rsm-fade">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--rsm-accent),transparent)] opacity-40"
      />

      <span
        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
          isError
            ? "bg-(--rsm-warn-soft)] text-(--rsm-warn)]"
            : "bg-(--rsm-accent-soft)] text-(--rsm-accent)]"
        }`}
      >
        {isError ? (
          <AlertIcon className="h-5 w-5" />
        ) : isNoMatch ? (
          <SearchIcon className="h-5 w-5" />
        ) : (
          <QuoteIcon className="h-5 w-5" />
        )}
      </span>

      <h2 className="font-serif text-xl text-(--rsm-ink)]">
        {TITLES[variant]}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-(--rsm-ink-soft)]">
        {description}
      </p>

      {isNoMatch && onReset && (
        <Button
          variant="outline"
          label="Bersihkan pencarian"
          onClick={onReset}
          className="rsm-action mt-6 cursor-pointer"
        >
          <SparklesIcon className="h-3.5 w-3.5" />
        </Button>
      )}

      {isError && onRetry && (
        <Button
          label="Coba lagi"
          onClick={onRetry}
          className="rsm-action mt-6 cursor-pointer hover:-translate-y-0.5"
        />
      )}
    </div>
  );
}
