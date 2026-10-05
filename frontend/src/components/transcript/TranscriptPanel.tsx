"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Transcript } from "@/types/transcript";
import { countCharacters, countWords, formatDateTime } from "@/lib/format";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
} from "@/components/icons/ActionIcons";
import { QuoteIcon } from "@/components/icons/MetaIcons";
import { useClipboard } from "@/hooks/useClipboard";
import TranscriptEmptyState from "./TranscriptEmptyState";

/** Tinggi area transkrip saat belum dibuka penuh. */
const COLLAPSED_MAX_HEIGHT = 420;
const OVERFLOW_TOLERANCE = 24;

interface TranscriptPanelProps {
  transcript: Transcript | null;
}

export default function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const { copiedKey, copy } = useClipboard();

  const text = transcript?.transcript_text ?? "";

  const stats = useMemo(
    () => ({ words: countWords(text), characters: countCharacters(text) }),
    [text],
  );

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const measure = () => setContentHeight(element.scrollHeight);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [text]);

  const canToggle = contentHeight > COLLAPSED_MAX_HEIGHT + OVERFLOW_TOLERANCE;
  const visibleHeight = canToggle && !isExpanded ? COLLAPSED_MAX_HEIGHT : contentHeight;
  const isCopied = copiedKey === "transcript";
  const isTruncated = canToggle && !isExpanded;

  const handleCopy = () => {
    if (!text) return;
    void copy(text, "transcript");
  };

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] animate-rsm-rise"
      style={{ animationDelay: "320ms" }}
      aria-labelledby="transcript-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--rsm-line)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--rsm-accent-soft)] text-(--rsm-accent)]">
            <QuoteIcon className="h-4 w-4" />
          </span>

          <div>
            <h2
              id="transcript-heading"
              className="font-serif text-lg leading-none text-(--rsm-ink)]"
            >
              Transkrip
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-(--rsm-ink-mute)]">
              {stats.words.toLocaleString("id-ID")} kata ·{" "}
              {stats.characters.toLocaleString("id-ID")} karakter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {transcript?.created_at && (
            <span className="hidden font-mono text-[10px] text-(--rsm-ink-mute)] sm:inline">
              {formatDateTime(transcript.created_at)}
            </span>
          )}

          {transcript && (
            <button
              type="button"
              onClick={handleCopy}
              className={`rsm-action inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                isCopied
                  ? "border-transparent bg-(--rsm-ok-soft)] text-(--rsm-ok)]"
                  : "border-(--rsm-line)] text-(--rsm-ink-soft)] hover:border-(--rsm-line-strong)] hover:text-(--rsm-ink)]"
              }`}
            >
              {isCopied ? (
                <CheckIcon className="h-3.5 w-3.5" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" />
              )}
              {isCopied ? "Tersalin" : "Salin"}
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-5">
        {transcript ? (
          <>
            <div
              className="relative overflow-hidden transition-[max-height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                maxHeight: visibleHeight > 0 ? `${visibleHeight}px` : undefined,
              }}
            >
              <div
                ref={contentRef}
                className="border-l-2 border-(--rsm-line-strong)] pl-5"
              >
                <p className="font-serif text-[15.5px] leading-[1.95] whitespace-pre-wrap text-(--rsm-ink)] selection:bg-(--rsm-accent-soft)] sm:text-base">
                  {text}
                </p>
              </div>

              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,var(--rsm-card))] transition-opacity duration-500 ${
                  isTruncated ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            {canToggle && (
              <button
                type="button"
                onClick={() => setIsExpanded((previous) => !previous)}
                className="group mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-(--rsm-accent)] transition-colors hover:text-(--rsm-accent-ink)]"
              >
                {isExpanded ? "Ringkas transkrip" : "Baca transkrip lengkap"}
                <ChevronDownIcon
                  className={`h-3.5 w-3.5 transition-transform duration-500 ${
                    isExpanded ? "rotate-180" : "group-hover:translate-y-0.5"
                  }`}
                />
              </button>
            )}
          </>
        ) : (
          <TranscriptEmptyState />
        )}
      </div>
    </section>
  );
}
