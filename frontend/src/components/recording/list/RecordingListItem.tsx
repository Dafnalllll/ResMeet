import Link from "next/link";

import type { Recording } from "@/types/recording";
import {
  formatDuration,
  formatRelativeDate,
  formatTimeOfDay,
} from "@/lib/format";
import { ArrowUpRightIcon } from "@/components/icons/ArrowIcons";
import { ClockIcon, TagIcon } from "@/components/icons/MetaIcons";
import StatusPill from "@/components/recording/detail/StatusPill";

const MAX_STAGGER_INDEX = 8;
const STAGGER_STEP_MS = 55;

interface RecordingListItemProps {
  recording: Recording;
  index: number;
}

export default function RecordingListItem({
  recording,
  index,
}: RecordingListItemProps) {
  const ordinal = (index + 1).toString().padStart(2, "0");

  return (
    <Link
      href={`/recordings/${recording.id}`}
      className="rsm-lift group relative block overflow-hidden rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] px-5 py-4 hover:border-(--rsm-line-strong)] animate-rsm-rise focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--rsm-accent)]"
      style={{
        animationDelay: `${Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP_MS}ms`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-0.75 origin-top scale-y-0 bg-(--rsm-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
      />

      <div className="flex items-start gap-4">
        <span className="hidden pt-1 font-mono text-[11px] tabular-nums text-(--rsm-ink-mute)] sm:block">
          {ordinal}
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="font-serif text-lg leading-snug text-(--rsm-ink)] transition-colors duration-300 group-hover:text-(--rsm-accent-ink)] sm:text-xl">
            {recording.title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-(--rsm-ink-soft)]">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <TagIcon className="h-3.5 w-3.5 shrink-0 text-(--rsm-ink-mute)]" />
              <span className="truncate font-mono text-[11px] text-(--rsm-ink-mute)]">
                {recording.filename}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 text-(--rsm-ink-mute)]" />
              <span className="font-mono text-[11px] tabular-nums">
                {formatDuration(recording.duration)}
              </span>
            </span>

            <span className="font-mono text-[11px] text-(--rsm-ink-mute)]">
              {formatRelativeDate(recording.created_at)} ·{" "}
              {formatTimeOfDay(recording.created_at)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <StatusPill status={recording.status} />

          <span className="hidden h-9 w-9 items-center justify-center rounded-full border border-(--rsm-line)] text-(--rsm-ink-mute)] transition-all duration-300 group-hover:border-(--rsm-accent)] group-hover:bg-(--rsm-accent-soft)] group-hover:text-(--rsm-accent)] sm:flex">
            <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
