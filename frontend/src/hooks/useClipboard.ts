"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_RESET_MS = 1800;

interface UseClipboardResult {
  /** Key dari nilai yang terakhir berhasil disalin. */
  copiedKey: string | null;
  copy: (value: string, key?: string) => Promise<boolean>;
}

/**
 * Menyalin teks ke clipboard + memberi umpan balik visual sementara.
 * Ada fallback untuk konteks non-secure (http) di mana Clipboard API absen.
 */
export function useClipboard(
  resetAfterMs = DEFAULT_RESET_MS,
): UseClipboardResult {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const writeToClipboard = useCallback(async (value: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }, []);

  const copy = useCallback(
    async (value: string, key?: string) => {
      try {
        await writeToClipboard(value);

        setCopiedKey(key ?? value);

        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          setCopiedKey(null);
          timeoutRef.current = null;
        }, resetAfterMs);

        return true;
      } catch (error) {
        console.error("Gagal menyalin ke clipboard:", error);
        return false;
      }
    },
    [resetAfterMs, writeToClipboard],
  );

  return { copiedKey, copy };
}
