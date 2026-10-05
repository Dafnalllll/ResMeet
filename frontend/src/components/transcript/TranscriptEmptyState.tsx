import { AlertIcon } from "@/components/icons/ActionIcons";
import { QuoteIcon } from "@/components/icons/MetaIcons";
import Button from "@/components/button/Button";

interface TranscriptEmptyStateProps {
  onRetry?: () => void;
}

export default function TranscriptEmptyState({
  onRetry,
}: TranscriptEmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-(--rsm-line-strong)] bg-(--rsm-paper)] px-5 py-8 text-center animate-rsm-fade">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--rsm-accent),transparent)] opacity-40" />

      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-(--rsm-warn-soft)] text-(--rsm-warn)]">
        <QuoteIcon className="h-5 w-5" />
      </span>

      <p className="font-serif text-lg text-(--rsm-ink)]">
        Belum ada transkrip untuk rekaman ini
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm text-(--rsm-ink-soft)]">
        Transkrip akan muncul otomatis setelah proses transkripsi rekaman
        selesai. Coba muat ulang halaman beberapa saat lagi.
      </p>

      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--rsm-warn-soft)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-(--rsm-warn)]">
        <AlertIcon className="h-3 w-3" />
        Menunggu proses
      </p>

      {onRetry && (
        <div>
          <Button
            label="Muat ulang transkrip"
            variant="outline"
            onClick={onRetry}
            className="mt-4"
          />
        </div>
      )}
    </div>
  );
}
