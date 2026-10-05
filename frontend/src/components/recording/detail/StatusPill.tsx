import { formatStatusLabel } from "@/lib/format";

export type StatusTone = "ok" | "busy" | "error" | "neutral";

const TONE_BY_STATUS: Record<string, StatusTone> = {
  uploaded: "neutral",
  UPLOADED: "neutral",
  queued: "busy",
  processing: "busy",
  PROCESSING: "busy",
  transcribing: "busy",
  transcribed: "ok",
  completed: "ok",
  COMPLETED: "ok",
  done: "ok",
  failed: "error",
  FAILED: "error",
  error: "error",
};

const TONE_STYLES: Record<
  StatusTone,
  { pill: string; dot: string; halo: string }
> = {
  ok: {
    pill: "bg-[var(--rsm-ok-soft)] text-[var(--rsm-ok)]",
    dot: "bg-[var(--rsm-ok)]",
    halo: "bg-[var(--rsm-ok)]",
  },
  busy: {
    pill: "bg-[var(--rsm-accent-soft)] text-[var(--rsm-accent-ink)]",
    dot: "bg-[var(--rsm-accent)]",
    halo: "bg-[var(--rsm-accent)]",
  },
  error: {
    pill: "bg-[var(--rsm-warn-soft)] text-[var(--rsm-warn)]",
    dot: "bg-[var(--rsm-warn)]",
    halo: "bg-[var(--rsm-warn)]",
  },
  neutral: {
    pill: "bg-[var(--rsm-line)] text-[var(--rsm-ink-soft)]",
    dot: "bg-[var(--rsm-ink-mute)]",
    halo: "bg-[var(--rsm-ink-mute)]",
  },
};

interface StatusPillProps {
  status: string;
}

export default function StatusPill({ status }: StatusPillProps) {
  const tone = TONE_BY_STATUS[status.trim().toLowerCase()] ?? "neutral";
  const styles = TONE_STYLES[tone];
  const isBusy = tone === "busy";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${styles.pill}`}
    >
      <span className="relative flex h-1.5 w-1.5 items-center justify-center">
        {isBusy && (
          <span
            className={`absolute inline-flex h-3 w-3 rounded-full opacity-60 animate-rsm-halo ${styles.halo}`}
          />
        )}
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      </span>
      {formatStatusLabel(status)}
    </span>
  );
}
