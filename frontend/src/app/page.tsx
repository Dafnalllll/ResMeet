"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons/ArrowIcons";
import PageShell from "@/components/layout/PageShell";
import { staggerEntrance } from "@/lib/animations";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll(".anim-item");
      staggerEntrance(Array.from(items), { delay: 100 });
    }
  }, []);

  return (
    <PageShell>
      <section className="flex min-h-[calc(100svh-10rem)] flex-col justify-center py-12">
        <div ref={containerRef} className="max-w-3xl space-y-7">
          <div className="anim-item opacity-0">
            <span className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-(--rsm-ink-mute)]">
              <span className="h-px w-9 bg-(--rsm-line-strong)]" />
              ResMeet Intelligence
            </span>
          </div>

          <div className="anim-item opacity-0">
            <h1 className="font-serif text-4xl leading-[1.08] font-semibold tracking-tight text-(--rsm-ink)] sm:text-6xl lg:text-7xl">
              AI Meeting Task Intelligence System
            </h1>
          </div>

          <div className="anim-item opacity-0">
            <p className="text-sm text-(--rsm-ink-mute)] max-w-xl leading-relaxed">
              Platform cerdas untuk merekam, mentranskripsi, dan mengekstrak tugas otomatis dari setiap sesi rapat Anda dengan dukungan AI mutakhir.
            </p>
          </div>

          <div className="anim-item opacity-0 pt-2">
            <Link
              href="/recordings"
              className="rsm-action group inline-flex items-center gap-3 rounded-full bg-(--rsm-accent)] px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--rsm-accent-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--rsm-accent)]"
            >
              Lihat daftar rekaman
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
