const LOCALE = "id-ID";
const FALLBACK = "—";

const STATUS_LABELS: Record<string, string> = {
  uploaded: "Terunggah",
  queued: "Dalam antrean",
  processing: "Diproses",
  transcribing: "Sedang ditranskripsi",
  transcribed: "Selesai",
  completed: "Selesai",
  done: "Selesai",
  failed: "Gagal",
  error: "Gagal",
};

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;

  const date = new Date(iso);
  return isValidDate(date) ? date : null;
}

/** 754 -> "12:34", 3725 -> "1:02:05", null/invalid -> "--:--" */
export function formatDuration(totalSeconds: number | null | undefined): string {
  if (
    totalSeconds === null ||
    totalSeconds === undefined ||
    !Number.isFinite(totalSeconds) ||
    totalSeconds < 0
  ) {
    return "--:--";
  }

  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(remainder)}`;
  }

  return `${minutes}:${pad(remainder)}`;
}

/** 754 -> "12 menit 34 detik" */
export function formatDurationLong(
  totalSeconds: number | null | undefined,
): string {
  if (
    totalSeconds === null ||
    totalSeconds === undefined ||
    !Number.isFinite(totalSeconds) ||
    totalSeconds <= 0
  ) {
    return "Durasi belum tersedia";
  }

  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  if (remainder > 0 || parts.length === 0) parts.push(`${remainder} detik`);

  return parts.join(" ");
}

/** "2026-09-19T07:46:00Z" -> "19 Sep 2026, 14.46" */
export function formatDateTime(iso: string | null | undefined): string {
  const date = parseDate(iso);
  if (!date) return FALLBACK;

  return date.toLocaleString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "2026-09-19T07:46:00Z" -> "Sabtu, 19 September 2026" */
export function formatFullDate(iso: string | null | undefined): string {
  const date = parseDate(iso);
  if (!date) return FALLBACK;

  return date.toLocaleDateString(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "2026-09-19T07:46:00Z" -> "14.46" */
export function formatTimeOfDay(iso: string | null | undefined): string {
  const date = parseDate(iso);
  if (!date) return FALLBACK;

  return date.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function countWords(text: string | null | undefined): number {
  if (!text) return 0;

  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function countCharacters(text: string | null | undefined): number {
  return text ? text.length : 0;
}

/** Fallback ke Title Case bila status belum dipetakan. */
export function formatStatusLabel(status: string | null | undefined): string {
  if (!status) return "Tidak diketahui";

  const normalized = status.trim().toLowerCase();
  const mapped = STATUS_LABELS[normalized];

  if (mapped) return mapped;

  const words = normalized.replace(/[_-]+/g, " ").split(" ").filter(Boolean);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Judul -> nama berkas aman untuk diunduh. */
export function toSafeFilename(title: string | null | undefined): string {
  const base = (title ?? "").trim() || "transcript";

  const sanitized = base
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized || "transcript";
}

/** UUID panjang dipersingkat agar rapi di daftar metadata. */
export function shortenId(id: string | null | undefined): string {
  if (!id) return FALLBACK;
  if (id.length <= 13) return id;

  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

/** "2026-09-19T07:46:00Z" -> "kemarin" / "3 hari lalu" */
export function formatRelativeDate(iso: string | null | undefined): string {
  const date = parseDate(iso);
  if (!date) return FALLBACK;

  const formatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });
  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000);

  const thresholds: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];

  for (const [unit, secondsPerUnit] of thresholds) {
    if (Math.abs(diffInSeconds) >= secondsPerUnit) {
      return formatter.format(
        Math.round(diffInSeconds / secondsPerUnit),
        unit,
      );
    }
  }

  return "baru saja";
}
