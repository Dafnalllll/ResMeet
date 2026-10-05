"use client";

import { AlertIcon } from "@/components/icons/ActionIcons";
import { ArrowLeftIcon } from "@/components/icons/ArrowIcons";
import Button from "@/components/button/Button";

export type NotFoundReason = "not-found" | "error";

const COPY: Record<NotFoundReason, { title: string; description: string }> = {
  "not-found": {
    title: "Rekaman tidak ditemukan",
    description:
      "Rekaman ini mungkin sudah dihapus, atau tautan yang kamu buka tidak lagi valid. Coba kembali ke daftar rekaman.",
  },
  error: {
    title: "Gagal memuat rekaman",
    description:
      "Terjadi kendala saat menghubungi server. Periksa koneksi lalu coba muat ulang halaman ini.",
  },
};

interface NotFoundStateProps {
  reason?: NotFoundReason;
  onBack: () => void;
  onRetry?: () => void;
}

export default function NotFoundState({
  reason = "not-found",
  onBack,
  onRetry,
}: NotFoundStateProps) {
  const { title, description } = COPY[reason];

  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-rsm-rise">
      <div className="rsm-lift relative w-full max-w-lg overflow-hidden rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] p-8 text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--rsm-warn),transparent)]"
        />

        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--rsm-warn-soft)] text-(--rsm-warn)]">
          <AlertIcon className="h-5 w-5" />
        </span>

        <h1 className="font-serif text-2xl text-(--rsm-ink)]">{title}</h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-(--rsm-ink-soft)]">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            label="Kembali ke daftar"
            onClick={onBack}
            className="rsm-action group hover:-translate-y-0.5"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          </Button>

          {onRetry && (
            <Button
              variant="outline"
              label="Coba lagi"
              onClick={onRetry}
              className="rsm-action"
            />
          )}
        </div>
      </div>
    </div>
  );
}
