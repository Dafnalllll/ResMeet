"use client";

import { useState, useRef, useCallback } from "react";
import { CloseIcon, SparklesIcon, FileTextIcon } from "@/components/icons/ActionIcons";
import { uploadRecording } from "@/services/recording";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".m4a", ".mp4"];

export default function UploadModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    const ext = "." + selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage("Format file tidak didukung. Harap unggah MP3, WAV, M4A, atau MP4.");
      return;
    }
    setErrorMessage(null);
    setFile(selectedFile);
    if (!title.trim()) {
      // Set default title from filename without extension
      const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf(".")) || selectedFile.name;
      setTitle(nameWithoutExt);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Pilih file audio atau video terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      await uploadRecording(file, title.trim() || undefined);
      setFile(null);
      setTitle("");
      setIsUploading(false);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Gagal mengunggah file:", error);
      setErrorMessage(error?.response?.data?.detail || "Gagal mengunggah file. Silakan coba lagi.");
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-rsm-fade"
        onClick={!isUploading ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] p-6 shadow-2xl animate-rsm-rise">
        <div className="flex items-center justify-between border-b border-(--rsm-line)] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--rsm-accent-soft)] text-(--rsm-accent)]">
              <SparklesIcon className="h-4 w-4" />
            </span>
            <h2
              id="upload-modal-title"
              className="font-serif text-xl font-semibold text-(--rsm-ink)]"
            >
              Unggah Rekaman Rapat
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            aria-label="Tutup"
            className="rounded-full p-1 text-(--rsm-ink-mute)] transition-colors hover:text-(--rsm-ink)] disabled:opacity-50"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Drag and Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              isDragging
                ? "border-(--rsm-accent)] bg-(--rsm-accent-soft)]/30"
                : "border-(--rsm-line)] hover:border-(--rsm-line-strong)] bg-(--rsm-card)]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.mp4,audio/*,video/mp4"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {file ? (
              <div className="flex items-center gap-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-(--rsm-accent-soft)] text-(--rsm-accent)]">
                  <FileTextIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-(--rsm-ink)]">
                    {file.name}
                  </p>
                  <p className="font-mono text-[11px] text-(--rsm-ink-mute)]">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · Klik atau seret untuk mengganti
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-(--rsm-line)] text-(--rsm-ink-soft)]">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-(--rsm-ink)]">
                    Seret dan lepas file audio/video di sini
                  </p>
                  <p className="text-xs text-(--rsm-ink-mute)]">
                    Atau klik untuk memilih dari perangkat (MP3, WAV, M4A, MP4)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="recording-title"
              className="block font-mono text-xs uppercase tracking-wider text-(--rsm-ink-soft)]"
            >
              Judul Rapat
            </label>
            <input
              id="recording-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul rapat..."
              className="w-full rounded-xl border border-(--rsm-line)] bg-(--rsm-card)] px-4 py-2.5 text-sm text-(--rsm-ink)] transition-colors outline-none focus:border-(--rsm-accent)]"
            />
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-(--rsm-warn-soft)] p-3 text-xs text-(--rsm-warn)]">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="cursor-pointer rounded-full border border-(--rsm-line)] bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-wider text-(--rsm-ink-soft)] transition-colors hover:border-(--rsm-line-strong)] hover:text-(--rsm-ink)] disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={!file || isUploading}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-(--rsm-accent)] px-5 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-(--rsm-accent-ink)] disabled:opacity-50"
            >
              {isUploading ? "Mengunggah & Transkripsi..." : "Unggah & Proses"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
