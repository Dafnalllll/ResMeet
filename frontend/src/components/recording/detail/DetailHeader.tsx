import type { Recording } from "@/types/recording";
import { formatDuration, formatDurationLong, formatFullDate, formatTimeOfDay } from "@/lib/format";
import { ArrowLeftIcon } from "@/components/icons/ArrowIcons";
import { CalendarIcon, ClockIcon, TagIcon } from "@/components/icons/MetaIcons";
import StatusPill from "./StatusPill";
import WaveformStrip from "./WaveformStrip";

interface DetailHeaderProps {
  recording: Recording;
  onBack: () => void;
}

export default function DetailHeader({ recording, onBack }: DetailHeaderProps) {
  return (
    <header className="space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="rsm-action cursor-pointer group inline-flex items-center gap-2 rounded-full border border-(--rsm-line)] bg-(--rsm-card)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-(--rsm-ink-soft)] transition-colors hover:border-(--rsm-line-strong)] hover:text-(--rsm-ink)] animate-rsm-fade"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        Kembali ke daftar
      </button>

      <div
        className="space-y-5 animate-rsm-rise"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-(--rsm-ink-mute)]">
            <span className="h-px w-8 bg-(--rsm-line-strong)]" />
            Catatan Rapat
          </span>
          <StatusPill status={recording.status} />
        </div>

        <h1 className="max-w-3xl font-serif text-3xl leading-tight font-semibold text-(--rsm-ink)] sm:text-4xl lg:text-5xl">
          {recording.title}
        </h1>

        <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-(--rsm-ink-soft)]">
          <div className="inline-flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-(--rsm-ink-mute)]" />
            <dt className="sr-only">Tanggal</dt>
            <dd>
              {formatFullDate(recording.created_at)} ·{" "}
              {formatTimeOfDay(recording.created_at)}
            </dd>
          </div>

          <div className="inline-flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-(--rsm-ink-mute)]" />
            <dt className="sr-only">Durasi</dt>
            <dd title={formatDurationLong(recording.duration)}>
              {formatDurationLong(recording.duration)}
            </dd>
          </div>

          <div className="inline-flex min-w-0 items-center gap-2">
            <TagIcon className="h-4 w-4 text-(--rsm-ink-mute)]" />
            <dt className="sr-only">Berkas</dt>
            <dd className="truncate font-mono text-xs text-(--rsm-ink-mute)]">
              {recording.filename}
            </dd>
          </div>
        </dl>
      </div>

      <div
        className="rsm-lift relative overflow-hidden rounded-2xl border border-(--rsm-line)] bg-[linear-gradient(180deg,var(--rsm-card),transparent)] px-5 py-4 animate-rsm-rise"
        style={{ animationDelay: "160ms" }}
      >
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-(--rsm-ink-mute)]">
          <span>Gelombang audio</span>
          <span className="tabular-nums">
            {formatDuration(recording.duration)}
          </span>
        </div>
        <WaveformStrip seed={recording.id} />
      </div>
    </header>
  );
}
