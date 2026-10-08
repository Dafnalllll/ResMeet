"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Recording } from "@/types/recording";
import { formatDuration } from "@/lib/format";
import { PlayIcon, PauseIcon } from "@/components/icons/ActionIcons";
import WaveformStrip from "./WaveformStrip";

interface MediaPlayerProps {
  recording: Recording;
}

export function isVideoRecording(recording: Recording): boolean {
  const mime = recording.mime_type?.toLowerCase() || "";
  const filename = recording.filename.toLowerCase();
  return (
    mime.startsWith("video/") ||
    filename.endsWith(".mp4") ||
    filename.endsWith(".webm") ||
    filename.endsWith(".mov") ||
    filename.endsWith(".m4v")
  );
}

export default function MediaPlayer({ recording }: MediaPlayerProps) {
  const isVideo = isVideoRecording(recording);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const streamUrl = `${apiBase}/recordings/${recording.id}/stream`;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(recording.duration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Gagal memutar audio:", err);
      });
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audio) {
      audio.currentTime = newTime;
    }
  }, []);

  const totalDuration = duration || recording.duration || 100;
  const progressPercent = totalDuration > 0 ? Math.min(100, Math.max(0, (currentTime / totalDuration) * 100)) : 0;

  if (isVideo) {
    return (
      <div
        className="rsm-lift relative overflow-hidden rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] p-4 shadow-(--rsm-elevation)] animate-rsm-rise"
        style={{ animationDelay: "160ms" }}
      >
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-(--rsm-ink-mute)]">
          <span>Pemutar Video & Audio Rapat</span>
          <span className="tabular-nums">
            {formatDuration(recording.duration)}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl bg-black">
          <video
            src={streamUrl}
            controls
            preload="metadata"
            className="aspect-video w-full object-contain"
          >
            Browser Anda tidak mendukung pemutaran video.
          </video>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rsm-lift relative overflow-hidden rounded-2xl border border-(--rsm-line)] bg-[linear-gradient(180deg,var(--rsm-card),transparent)] p-5 animate-rsm-rise"
      style={{ animationDelay: "160ms" }}
    >
      <audio ref={audioRef} src={streamUrl} preload="metadata" />

      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-(--rsm-ink-mute)]">
        <span>Pemutar Audio Rapat</span>
        <span className="tabular-nums">
          {formatDuration(currentTime)} / {formatDuration(duration || recording.duration)}
        </span>
      </div>

      <div className="mb-4">
        <WaveformStrip seed={recording.id} isActive={isPlaying} />
      </div>

      <div className="space-y-3">
        {/* Seek / Scrubber Bar with filled track */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tabular-nums text-(--rsm-ink-mute)]">
            {formatDuration(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-(--rsm-line)] accent-(--rsm-accent)] focus:outline-none"
            style={{
              background: `linear-gradient(to right, var(--rsm-accent) ${progressPercent}%, var(--rsm-line) ${progressPercent}%)`,
            }}
            aria-label="Atur posisi audio"
          />
          <span className="font-mono text-[11px] tabular-nums text-(--rsm-ink-mute)]">
            {formatDuration(totalDuration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={togglePlay}
            className="rsm-action cursor-pointer inline-flex items-center gap-2.5 rounded-full bg-(--rsm-accent)] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
          >
            {isPlaying ? (
              <>
                <PauseIcon className="h-4 w-4" />
                Jeda Audio
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4" />
                Putar Audio
              </>
            )}
          </button>

          <span className="font-mono text-[10px] text-(--rsm-ink-mute)] uppercase tracking-wider">
            {recording.filename}
          </span>
        </div>
      </div>
    </div>
  );
}
