import type { Recording } from "@/types/recording";
import {
  formatDateTime,
  formatDuration,
  formatDurationLong,
} from "@/lib/format";
import {
  CalendarIcon,
  ClockIcon,
  HashIcon,
  TagIcon,
  WaveformIcon,
} from "@/components/icons/MetaIcons";
import MetadataRow from "./MetadataRow";
import StatusPill from "./StatusPill";

interface MetadataPanelProps {
  recording: Recording;
}

export default function MetadataPanel({ recording }: MetadataPanelProps) {
  return (
    <section
      className="rsm-lift relative overflow-hidden rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] p-4 shadow-(--rsm-elevation)] animate-rsm-rise sm:p-5"
      style={{ animationDelay: "240ms" }}
      aria-labelledby="metadata-heading"
    >
      <div className="mb-2 flex items-center justify-between px-3">
        <h2
          id="metadata-heading"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--rsm-ink-mute)]"
        >
          Informasi Berkas
        </h2>
        <span className="font-mono text-[10px] text-(--rsm-ink-mute)]">
          {formatDuration(recording.duration)}
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <MetadataRow
          label="ID Rekaman"
          value={recording.id}
          icon={<HashIcon className="h-4 w-4" />}
          mono
          copyable
        />

        <MetadataRow
          label="Nama Berkas"
          value={recording.filename}
          icon={<TagIcon className="h-4 w-4" />}
          mono
          copyable
        />

        <MetadataRow
          label="Durasi"
          value={`${formatDuration(recording.duration)} (${formatDurationLong(
            recording.duration,
          )})`}
          icon={<ClockIcon className="h-4 w-4" />}
        >
          <span className="tabular-nums">
            {formatDuration(recording.duration)}
          </span>
        </MetadataRow>

        <MetadataRow
          label="Status"
          value={recording.status}
          icon={<WaveformIcon className="h-4 w-4" />}
        >
          <StatusPill status={recording.status} />
        </MetadataRow>

        <MetadataRow
          label="Dibuat Pada"
          value={formatDateTime(recording.created_at)}
          icon={<CalendarIcon className="h-4 w-4" />}
        />
      </dl>
    </section>
  );
}
