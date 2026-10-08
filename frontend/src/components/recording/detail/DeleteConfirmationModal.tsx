"use client";

import { useEffect } from "react";
import { TrashIcon, CloseIcon } from "@/components/icons/ActionIcons";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  title = "Hapus Recording",
  message = "Apakah Anda yakin ingin menghapus recording ini beserta transkripnya? Tindakan ini tidak dapat dibatalkan.",
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-rsm-fade"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative bg-black w-full max-w-md rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] p-6 shadow-2xl animate-rsm-rise">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <TrashIcon className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h2
                id="modal-title"
                className="font-serif text-lg font-semibold text-(--rsm-ink)]"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onCancel}
                disabled={isDeleting}
                aria-label="Tutup"
                className="rounded-full p-1 text-(--rsm-ink-mute)] transition-colors hover:text-(--rsm-ink)] disabled:opacity-50"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-(--rsm-ink-soft)]">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-(--rsm-line)] pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="cursor-pointer rounded-full border border-(--rsm-line)] bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-wider text-(--rsm-ink-soft)] transition-colors hover:border-(--rsm-line-strong)] hover:text-(--rsm-ink)] disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
