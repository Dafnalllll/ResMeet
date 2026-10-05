"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { buttonActions } from "@/components/button";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import DetailHeader from "@/components/recording/detail/DetailHeader";
import DetailSkeleton from "@/components/recording/detail/DetailSkeleton";
import DetailToast from "@/components/recording/detail/DetailToast";
import MetadataPanel from "@/components/recording/detail/MetadataPanel";
import NotFoundState, {
  type NotFoundReason,
} from "@/components/recording/detail/NotFoundState";
import DownloadBar from "@/components/transcript/DownloadBar";
import TranscriptPanel from "@/components/transcript/TranscriptPanel";
import { isNotFoundError } from "@/lib/apiError";
import {
  downloadTranscriptDocx,
  downloadTranscriptPdf,
  downloadTranscriptTxt,
} from "@/lib/transcriptExport";
import { getRecordingById } from "@/services/recording";
import { getTranscriptByRecordingId } from "@/services/transcript";
import type { Recording } from "@/types/recording";
import type { Transcript } from "@/types/transcript";

/** Komponen utama halaman detail, termasuk pemuatan data dan aksi ekspor. */
export default function Detail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const recordingId = params.id;

  const [recording, setRecording] = useState<Recording | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorReason, setErrorReason] = useState<NotFoundReason | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const exportTitle = recording?.title ?? "transcript";

  useEffect(() => {
    let isCancelled = false;

    Promise.allSettled([
      getRecordingById(recordingId),
      getTranscriptByRecordingId(recordingId),
    ]).then(([recordingResult, transcriptResult]) => {
      if (isCancelled) return;

      if (recordingResult.status === "fulfilled") {
        setRecording(recordingResult.value);
        setErrorReason(null);
      } else {
        const reason: NotFoundReason = isNotFoundError(recordingResult.reason)
          ? "not-found"
          : "error";
        setRecording(null);
        setErrorReason(reason);
        console.error("Gagal memuat recording:", recordingResult.reason);
      }

      if (transcriptResult.status === "fulfilled") {
        setTranscript(transcriptResult.value);
      } else {
        setTranscript(null);
        console.error("Gagal memuat transkrip:", transcriptResult.reason);
      }
    }).finally(() => {
      if (!isCancelled) setIsLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [recordingId, reloadKey]);

  const handleBack = useCallback(() => {
    buttonActions.navigateTo(router, "/recordings");
  }, [router]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setErrorReason(null);
    setReloadKey((previous) => previous + 1);
  }, []);

  const handleDismissToast = useCallback(() => setToastMessage(null), []);

  const handleDownloadTxt = useCallback(() => {
    if (!transcript) return;
    downloadTranscriptTxt(transcript.transcript_text, exportTitle);
    setToastMessage("Transkrip TXT sedang diunduh.");
  }, [exportTitle, transcript]);

  const handleDownloadPdf = useCallback(async () => {
    if (!transcript) return;
    try {
      await downloadTranscriptPdf(transcript.transcript_text, exportTitle);
      setToastMessage("Transkrip PDF sedang diunduh.");
    } catch (error) {
      console.error("Gagal mengunduh transkrip PDF:", error);
      setToastMessage("Gagal mengunduh transkrip PDF. Coba lagi.");
    }
  }, [exportTitle, transcript]);

  const handleDownloadDocx = useCallback(async () => {
    if (!transcript) return;
    try {
      await downloadTranscriptDocx(transcript.transcript_text, exportTitle);
      setToastMessage("Transkrip DOCX sedang diunduh.");
    } catch (error) {
      console.error("Gagal mengunduh transkrip DOCX:", error);
      setToastMessage("Gagal mengunduh transkrip DOCX. Coba lagi.");
    }
  }, [exportTitle, transcript]);

  const content = isLoading ? (
    <DetailSkeleton />
  ) : errorReason || !recording ? (
    <NotFoundState
      reason={errorReason ?? "not-found"}
      onBack={handleBack}
      onRetry={handleRetry}
    />
  ) : (
    <div className="space-y-8">
      <DetailHeader recording={recording} onBack={handleBack} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
          <MetadataPanel recording={recording} />
        </div>
        <div className="lg:col-span-3">
          <div className="space-y-3">
            <TranscriptPanel transcript={transcript} />
            <Link
              href={`/transcript/${recording.id}`}
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-(--rsm-accent)] transition-colors hover:text-(--rsm-accent-ink)]"
            >
              Buka transkrip lengkap
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </Link>
          </div>
        </div>
      </div>

      <DownloadBar
        hasTranscript={Boolean(transcript?.transcript_text.trim())}
        onDownloadTxt={handleDownloadTxt}
        onDownloadPdf={handleDownloadPdf}
        onDownloadDocx={handleDownloadDocx}
      />

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-(--rsm-line)] pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-(--rsm-ink-mute)] animate-rsm-fade">
        <span>ResMeet · Catatan Rapat</span>
        <span className="truncate normal-case tracking-normal">{recording.filename}</span>
      </footer>
    </div>
  );

  return (
    <>
      <PageShell>{content}</PageShell>
      <DetailToast message={toastMessage} onDismiss={handleDismissToast} />
    </>
  );
}
