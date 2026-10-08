"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function AnimeTest() {
  const boxRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (boxRef.current) {
      animate(boxRef.current, {
        scale: [1, 1.25, 1],
        rotate: "+=360",
        backgroundColor: ["#10b981", "#6366f1", "#f43f5e", "#10b981"],
        duration: 800,
        easing: "easeInOutQuad",
      });
    }
  };

  useEffect(() => {
    // Initial mount animation
    if (boxRef.current) {
      animate(boxRef.current, {
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: "easeOutExpo",
      });
    }
  }, []);

  return (
    <div className="mt-8 rounded-2xl border border-(--rsm-line)] bg-(--rsm-surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold text-(--rsm-ink)]">
            Anime.js Interactive Test
          </h2>
          <p className="text-xs text-(--rsm-ink-mute)] mt-1">
            Klik tombol di bawah untuk memicu animasi menggunakan anime.js v4.
          </p>
        </div>
        <button
          onClick={handleClick}
          className="rounded-lg bg-(--rsm-accent)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition hover:opacity-90"
        >
          Animasikan!
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center py-10">
        <div
          ref={boxRef}
          className="flex h-24 w-24 items-center justify-center rounded-xl bg-(--rsm-accent)] text-white font-mono text-xs font-bold shadow-md cursor-pointer"
          onClick={handleClick}
        >
          ANIME.JS
        </div>
      </div>
    </div>
  );
}
