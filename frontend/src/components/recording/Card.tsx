"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import PageShell from "@/components/layout/PageShell";
import ListHeader from "@/components/recording/list/ListHeader";
import RecordingListItem from "@/components/recording/list/RecordingListItem";
import RecordingListSkeleton from "@/components/recording/list/RecordingListSkeleton";
import RecordingsEmptyState from "@/components/recording/list/RecordingsEmptyState";
import UploadModal from "@/components/recording/list/UploadModal";
import { getRecordings } from "@/services/recording";
import type { Recording } from "@/types/recording";

function byNewestFirst(left: Recording, right: Recording): number {
  return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
}

/** Komponen utama arsip: memuat, mencari, dan menampilkan daftar rekaman. */
export default function Card() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    getRecordings()
      .then((data) => {
        if (!isCancelled) {
          setRecordings(data);
          setHasError(false);
        }
      })
      .catch((error: unknown) => {
        console.error("Gagal memuat daftar rekaman:", error);
        if (!isCancelled) setHasError(true);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  // Polling otomatis jika ada recording yang sedang PROCESSING
  useEffect(() => {
    const hasProcessing = recordings.some(
      (r) =>
        r.processing_status?.toUpperCase() === "PROCESSING" ||
        r.transcription_status?.toUpperCase() === "PROCESSING"
    );

    if (!hasProcessing) return;

    const interval = setInterval(() => {
      getRecordings()
        .then((data) => {
          setRecordings(data);
        })
        .catch((err) => {
          console.error("Gagal poll daftar rekaman:", err);
        });
    }, 4000);

    return () => clearInterval(interval);
  }, [recordings]);

  const visibleRecordings = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return [...recordings].sort(byNewestFirst).filter((recording) => {
      if (!keyword) return true;
      return (
        recording.title.toLowerCase().includes(keyword) ||
        recording.filename.toLowerCase().includes(keyword)
      );
    });
  }, [query, recordings]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setReloadKey((previous) => previous + 1);
  }, []);

  const content = isLoading ? (
    <RecordingListSkeleton />
  ) : (
    <div className="space-y-8">
      <ListHeader
        totalCount={recordings.length}
        visibleCount={visibleRecordings.length}
        query={query}
        onQueryChange={setQuery}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      <section aria-label="Daftar rekaman">
        {hasError ? (
          <RecordingsEmptyState variant="error" onRetry={handleRetry} />
        ) : recordings.length === 0 ? (
          <RecordingsEmptyState variant="no-recordings" />
        ) : visibleRecordings.length === 0 ? (
          <RecordingsEmptyState
            variant="no-match"
            query={query}
            onReset={() => setQuery("")}
          />
        ) : (
          <ul className="space-y-3">
            {visibleRecordings.map((recording, index) => (
              <li key={recording.id}>
                <RecordingListItem recording={recording} index={index} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="border-t border-(--rsm-line)] pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-(--rsm-ink-mute)] animate-rsm-fade">
        ResMeet · AI Meeting Task Intelligence System
      </footer>
    </div>
  );

  return (
    <>
      <PageShell>{content}</PageShell>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => setReloadKey((prev) => prev + 1)}
      />
    </>
  );
}
