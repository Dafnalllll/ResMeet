"use client";

import { SearchIcon, SparklesIcon } from "@/components/icons/ActionIcons";

interface ListHeaderProps {
  totalCount: number;
  visibleCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  onOpenUploadModal: () => void;
}

export default function ListHeader({
  totalCount,
  visibleCount,
  query,
  onQueryChange,
  onOpenUploadModal,
}: ListHeaderProps) {
  const isFiltering = query.trim().length > 0;

  return (
    <header
      className="space-y-6 animate-rsm-rise"
      style={{ animationDelay: "40ms" }}
    >
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-(--rsm-ink-mute)]">
          <span className="h-0.5 w-8 bg-(--rsm-line-strong)]" />
          Arsip Rapat
        </span>

        <h1 className="font-serif text-3xl leading-tight font-semibold text-(--rsm-ink)] sm:text-4xl lg:text-5xl">
          Rekaman Rapat
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-(--rsm-ink-soft)]">
          Semua rekaman beserta transkripnya tersimpan di sini. Pilih satu
          rekaman untuk membaca transkrip lengkapnya atau unggah rekaman baru.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--rsm-ink-mute)]">
          {isFiltering
            ? `${visibleCount.toLocaleString("id-ID")} dari ${totalCount.toLocaleString("id-ID")} rekaman`
            : `${totalCount.toLocaleString("id-ID")} rekaman`}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-(--rsm-accent)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-(--rsm-accent-ink)]"
          >
            <SparklesIcon className="h-4 w-4" />
            Unggah Rekaman
          </button>

          <label className="group relative flex w-full items-center sm:max-w-xs">
            <span className="pointer-events-none absolute left-3.5 text-(--rsm-ink-mute)] transition-colors group-focus-within:text-(--rsm-accent)]">
              <SearchIcon className="h-4 w-4" />
            </span>

            <span className="sr-only">Cari rekaman</span>

            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Cari judul atau nama berkas…"
              className="w-full rounded-full border border-(--rsm-line)] bg-(--rsm-card)] py-2.5 pr-4 pl-10 text-sm text-(--rsm-ink)] transition-colors outline-none placeholder:text-(--rsm-ink-mute)] focus:border-(--rsm-accent)]"
            />
          </label>
        </div>
      </div>
    </header>
  );
}
