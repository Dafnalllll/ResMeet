import Link from "next/link";

import PageShell from "@/components/layout/PageShell";

export default function TranscriptIndexPage() {
  return (
    <PageShell>
      <section className="flex min-h-[60vh] flex-col items-start justify-center gap-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-(--rsm-ink-mute)]">
          Arsip Transkrip
        </span>
        <h1 className="max-w-2xl font-serif text-3xl leading-tight font-semibold text-(--rsm-ink)] sm:text-5xl">
          Pilih rekaman untuk membuka transkrip
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-(--rsm-ink-soft)] sm:text-base">
          Setiap transkrip terhubung dengan rekaman rapatnya. Buka arsip untuk
          memilih rekaman dan melihat transkrip lengkap.
        </p>
        <Link
          href="/recordings"
          className="rsm-action inline-flex items-center rounded-full bg-(--rsm-accent)] px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-(--rsm-accent-ink)]"
        >
          Buka arsip rekaman
        </Link>
      </section>
    </PageShell>
  );
}
