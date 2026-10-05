"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useClipboard } from "@/hooks/useClipboard";
import { formatDateTime, formatDurationLong } from "@/lib/format";
import { getTranscriptStats, splitTranscriptParagraphs } from "@/lib/transcript";
import {
  downloadTranscriptDocx,
  downloadTranscriptPdf,
  downloadTranscriptTxt,
} from "@/lib/transcriptExport";
import { isNotFoundError } from "@/lib/apiError";
import { getRecordingById } from "@/services/recording";
import { getTranscriptByRecordingId } from "@/services/transcript";
import type { Recording } from "@/types/recording";
import type { Transcript } from "@/types/transcript";

import PageShell from "@/components/layout/PageShell";
import DetailToast from "@/components/recording/detail/DetailToast";
import DownloadBar from "@/components/transcript/DownloadBar";
import NotFoundState, {
  type NotFoundReason,
} from "@/components/recording/detail/NotFoundState";
import TranscriptEmptyState from "@/components/transcript/TranscriptEmptyState";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons/ArrowIcons";
import {
  CheckIcon,
  CloseIcon,
  CopyIcon,
  SearchIcon,
} from "@/components/icons/ActionIcons";
import { CalendarIcon, ClockIcon, TagIcon } from "@/components/icons/MetaIcons";

const EXPORT_MESSAGES = {
  txt: "Transkrip TXT sedang diunduh.",
  pdf: "Transkrip PDF sedang diunduh.",
  docx: "Transkrip DOCX sedang diunduh.",
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(text: string, query: string): number {
  const term = query.trim();
  if (!term) return 0;
  return text.match(new RegExp(escapeRegExp(term), "gi"))?.length ?? 0;
}

function HighlightedParagraph({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const term = query.trim();
  if (!term) return <>{text}</>;

  const pieces = text.split(new RegExp(`(${escapeRegExp(term)})`, "gi"));
  return (
    <>
      {pieces.map((piece, index) =>
        piece.toLocaleLowerCase() === term.toLocaleLowerCase() ? (
          <mark
            key={`${index}-${piece}`}
            className="rounded bg-(--rsm-accent-soft)] px-0.5 text-inherit"
          >
            {piece}
          </mark>
        ) : (
          <span key={`${index}-${piece}`}>{piece}</span>
        ),
      )}
    </>
  );
}

function TranscriptLoading() {
  return (
    <div className="space-y-8 animate-rsm-fade" role="status" aria-label="Memuat transkrip">
      <div className="space-y-4">
        <div className="rsm-skeleton h-4 w-28 rounded-full" />
        <div className="rsm-skeleton h-11 w-3/4 rounded-xl" />
        <div className="rsm-skeleton h-5 w-1/2 rounded-lg" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rsm-skeleton h-20 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-4 rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] p-6">
        {Array.from({ length: 7 }, (_, index) => (
          <div
            key={index}
            className={`rsm-skeleton h-4 rounded-full ${index % 3 === 2 ? "w-4/5" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TranscriptPage() {
  const { recordingId } = useParams<{ recordingId: string }>();
  const router = useRouter();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recordingError, setRecordingError] = useState<NotFoundReason | null>(null);
  const [transcriptError, setTranscriptError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { copiedKey, copy } = useClipboard();

  useEffect(() => {
    let isCancelled = false;

    Promise.allSettled([
      getRecordingById(recordingId),
      getTranscriptByRecordingId(recordingId),
    ])
      .then(([recordingResult, transcriptResult]) => {
        if (isCancelled) return;

        if (recordingResult.status === "fulfilled") {
          setRecording(recordingResult.value);
          setRecordingError(null);
        } else {
          setRecording(null);
          setRecordingError(
            isNotFoundError(recordingResult.reason) ? "not-found" : "error",
          );
          console.error("Gagal memuat rekaman:", recordingResult.reason);
        }

        if (transcriptResult.status === "fulfilled") {
          setTranscript(transcriptResult.value);
          setTranscriptError(false);
        } else {
          setTranscript(null);
          setTranscriptError(true);
          console.error("Gagal memuat transkrip:", transcriptResult.reason);
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [recordingId, reloadKey]);

  const text = transcript?.transcript_text ?? "";
  const paragraphs = useMemo(() => splitTranscriptParagraphs(text), [text]);
  const stats = useMemo(() => getTranscriptStats(text), [text]);
  const matchCount = useMemo(
    () => paragraphs.reduce((total, paragraph) => total + countMatches(paragraph, query), 0),
    [paragraphs, query],
  );
  const hasTranscript = Boolean(transcript && text.trim());

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setRecordingError(null);
    setTranscriptError(false);
    setReloadKey((previous) => previous + 1);
  }, []);

  const handleExportError = useCallback((format: string, error: unknown) => {
    console.error(`Gagal mengekspor transkrip ${format}:`, error);
    setToastMessage(`Gagal mengunduh transkrip ${format}. Coba lagi.`);
  }, []);

  const handleDownloadTxt = useCallback(() => {
    if (!hasTranscript || !recording) return;
    try {
      downloadTranscriptTxt(text, recording.title);
      setToastMessage(EXPORT_MESSAGES.txt);
    } catch (error) {
      handleExportError("TXT", error);
    }
  }, [handleExportError, hasTranscript, recording, text]);

  const handleDownloadPdf = useCallback(async () => {
    if (!hasTranscript || !recording) return;
    try {
      await downloadTranscriptPdf(text, recording.title);
      setToastMessage(EXPORT_MESSAGES.pdf);
    } catch (error) {
      handleExportError("PDF", error);
    }
  }, [handleExportError, hasTranscript, recording, text]);

  const handleDownloadDocx = useCallback(async () => {
    if (!hasTranscript || !recording) return;
    try {
      await downloadTranscriptDocx(text, recording.title);
      setToastMessage(EXPORT_MESSAGES.docx);
    } catch (error) {
      handleExportError("DOCX", error);
    }
  }, [handleExportError, hasTranscript, recording, text]);

  const handleCopy = useCallback(async () => {
    if (!hasTranscript) return;
    const succeeded = await copy(text, "full-transcript");
    setToastMessage(
      succeeded ? "Seluruh transkrip berhasil disalin." : "Gagal menyalin transkrip.",
    );
  }, [copy, hasTranscript, text]);

  if (isLoading) {
    return (
      <PageShell>
        <TranscriptLoading />
      </PageShell>
    );
  }

  if (recordingError || !recording) {
    return (
      <PageShell>
        <NotFoundState
          reason={recordingError ?? "not-found"}
          onBack={() => router.push("/recordings")}
          onRetry={handleRetry}
        />
      </PageShell>
    );
  }

  return (
    <>
      <PageShell>
        <div className="space-y-8">
          <header className="space-y-6 animate-rsm-rise">
            <Link
              href={`/recordings/${recording.id}`}
              className="rsm-action group inline-flex items-center gap-2 rounded-full border border-(--rsm-line)] bg-(--rsm-card)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-(--rsm-ink-soft)] transition-colors hover:border-(--rsm-line-strong)] hover:text-(--rsm-ink)]"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              Kembali ke detail rekaman
            </Link>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-(--rsm-ink-mute)]">
                <span className="h-px w-8 bg-(--rsm-line-strong)]" />
                Transkrip Rapat
              </span>
              <h1 className="max-w-4xl font-serif text-3xl leading-tight font-semibold text-(--rsm-ink)] sm:text-4xl lg:text-5xl">
                {recording.title}
              </h1>
              <dl className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-(--rsm-ink-soft)]">
                <div className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-(--rsm-ink-mute)]" />
                  <dt className="sr-only">Dibuat pada</dt>
                  <dd>{formatDateTime(recording.created_at)}</dd>
                </div>
                <div className="inline-flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-(--rsm-ink-mute)]" />
                  <dt className="sr-only">Durasi</dt>
                  <dd>{formatDurationLong(recording.duration)}</dd>
                </div>
                <div className="inline-flex min-w-0 items-center gap-2">
                  <TagIcon className="h-4 w-4 shrink-0 text-(--rsm-ink-mute)]" />
                  <dt className="sr-only">Nama berkas</dt>
                  <dd className="truncate font-mono text-xs">{recording.filename}</dd>
                </div>
              </dl>
            </div>
          </header>

          <section aria-label="Statistik transkrip" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Kata", value: stats.words.toLocaleString("id-ID") },
              { label: "Karakter", value: stats.characters.toLocaleString("id-ID") },
              { label: "Paragraf", value: stats.paragraphs.toLocaleString("id-ID") },
              {
                label: "Waktu baca",
                value:
                  stats.readingMinutes === 0
                    ? "0 menit"
                    : `~${stats.readingMinutes} menit`,
              },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--rsm-ink-mute)]">{label}</p>
                <p className="mt-2 font-serif text-2xl text-(--rsm-ink)]">{value}</p>
              </div>
            ))}
          </section>

          <section
            className="overflow-hidden rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] animate-rsm-rise"
            aria-labelledby="full-transcript-heading"
          >
            <div className="flex flex-col gap-4 border-b border-(--rsm-line)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 id="full-transcript-heading" className="font-serif text-xl text-(--rsm-ink)]">
                  Isi transkrip
                </h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-(--rsm-ink-mute)]">
                  {transcript ? `Dibuat ${formatDateTime(transcript.created_at)}` : "Transkrip belum tersedia"}
                </p>
              </div>

              {hasTranscript && (
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  className={`rsm-action inline-flex items-center justify-center gap-2 self-start rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors sm:self-auto ${
                    copiedKey === "full-transcript"
                      ? "border-transparent bg-(--rsm-ok-soft)] text-(--rsm-ok)]"
                      : "border-(--rsm-line)] text-(--rsm-ink-soft)] hover:border-(--rsm-line-strong)] hover:text-(--rsm-ink)]"
                  }`}
                >
                  {copiedKey === "full-transcript" ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5" />
                  )}
                  {copiedKey === "full-transcript" ? "Tersalin" : "Salin transkrip"}
                </button>
              )}
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
              {transcriptError ? (
                <div className="rounded-xl border border-(--rsm-warn-soft)] bg-(--rsm-warn-soft)] p-5 text-sm text-(--rsm-ink-soft)]" role="alert">
                  <p>Transkrip gagal dimuat. Coba muat ulang data transkrip.</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--rsm-accent)] underline underline-offset-4"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : !hasTranscript ? (
                <TranscriptEmptyState onRetry={handleRetry} />
              ) : (
                <>
                  <label className="relative block">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--rsm-ink-mute)]">
                      <SearchIcon className="h-4 w-4" />
                    </span>
                    <span className="sr-only">Cari di dalam transkrip</span>
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Cari kata atau frasa di transkrip…"
                      className="w-full rounded-full border border-(--rsm-line)] bg-(--rsm-paper)] py-3 pr-11 pl-11 text-sm text-(--rsm-ink)] outline-none placeholder:text-(--rsm-ink-mute)] focus:border-(--rsm-accent)]"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Hapus pencarian"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-(--rsm-ink-mute)] transition-colors hover:text-(--rsm-ink)]"
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    )}
                  </label>

                  {query.trim() && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-(--rsm-ink-mute)]" aria-live="polite">
                      {matchCount.toLocaleString("id-ID")} kecocokan
                      {matchCount === 0 && " — tidak ada hasil untuk pencarian ini"}
                    </p>
                  )}

                  <div className="space-y-5 border-l-2 border-(--rsm-line-strong)] pl-5 sm:pl-6">
                    {paragraphs.map((paragraph, index) => (
                      <p key={`${index}-${paragraph.slice(0, 24)}`} className="font-serif text-[15.5px] leading-[1.95] whitespace-pre-wrap text-(--rsm-ink)] selection:bg-(--rsm-accent-soft)] sm:text-base">
                        <HighlightedParagraph text={paragraph} query={query} />
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          <DownloadBar
            hasTranscript={hasTranscript && !transcriptError}
            onDownloadTxt={handleDownloadTxt}
            onDownloadPdf={handleDownloadPdf}
            onDownloadDocx={handleDownloadDocx}
          />

          <div className="flex justify-end">
            <Link
              href={`/recordings/${recording.id}`}
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-(--rsm-accent)] transition-colors hover:text-(--rsm-accent-ink)]"
            >
              Buka detail rapat
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </PageShell>
      <DetailToast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </>
  );
}
