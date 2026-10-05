"use client";

import {
  FileDocxIcon,
  FilePdfIcon,
  FileTextIcon,
  SparklesIcon,
} from "@/components/icons/ActionIcons";
import ExportButton from "./ExportButton";

interface DownloadBarProps {
  hasTranscript: boolean;
  onDownloadTxt: () => void;
  onDownloadPdf: () => void;
  onDownloadDocx: () => void;
}

export default function DownloadBar({
  hasTranscript,
  onDownloadTxt,
  onDownloadPdf,
  onDownloadDocx,
}: DownloadBarProps) {
  return (
    <section
      className="rsm-lift relative overflow-hidden rounded-2xl border border-(--rsm-line)] bg-[linear-gradient(135deg,var(--rsm-card),var(--rsm-paper))] p-5 animate-rsm-rise sm:p-6"
      style={{ animationDelay: "400ms" }}
      aria-labelledby="export-heading"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-(--rsm-accent-soft)] blur-2xl"
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between ">
        <div className="max-w-sm space-y-2">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-(--rsm-accent)]">
            <SparklesIcon className="h-3.5 w-3.5" />
            Ekspor
          </span>

          <h2
            id="export-heading"
            className="font-serif text-xl text-(--rsm-ink)]"
          >
            Bagikan catatan rapat ini
          </h2>

          <p className="text-sm leading-relaxed text-(--rsm-ink-soft)]">
            {hasTranscript
              ? "Unduh transkrip dalam format teks, atau siapkan versi dokumen untuk dibagikan ke tim."
              : "Transkrip belum tersedia, jadi ekspor belum bisa dijalankan."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ExportButton
            label="Unduh TXT"
            hint="teks polos"
            variant="solid"
            disabled={!hasTranscript}
            icon={<FileTextIcon className="h-5 w-5" />}
            onClick={onDownloadTxt}
          />

          <ExportButton
            label="Unduh PDF"
            hint="dokumen PDF"
            variant="solid"
            disabled={!hasTranscript}
            icon={<FilePdfIcon className="h-5 w-5" />}
            onClick={onDownloadPdf}
          />

          <ExportButton
            label="Unduh DOCX"
            hint="dokumen Word"
            variant="solid"
            disabled={!hasTranscript}
            icon={<FileDocxIcon className="h-5 w-5" />}
            onClick={onDownloadDocx}
          />
        </div>
      </div>
    </section>
  );
}
