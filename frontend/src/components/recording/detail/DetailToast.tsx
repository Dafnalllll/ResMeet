"use client";

import { useEffect, useRef } from "react";

import { CloseIcon, SparklesIcon } from "@/components/icons/ActionIcons";

const AUTO_DISMISS_MS = 3600;

interface DetailToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function DetailToast({ message, onDismiss }: DetailToastProps) {
  const dismissRef = useRef(onDismiss);

  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => dismissRef.current(), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-5 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] px-4 py-3 shadow-(--rsm-elevation)] animate-rsm-rise sm:inset-x-auto sm:right-6"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--rsm-accent-soft)] text-(--rsm-accent)]">
        <SparklesIcon className="h-3.5 w-3.5" />
      </span>

      <p className="flex-1 text-sm leading-snug text-(--rsm-ink)]">
        {message}
      </p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="shrink-0 rounded-full p-1 text-(--rsm-ink-mute)] transition-colors hover:text-(--rsm-ink)]"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
