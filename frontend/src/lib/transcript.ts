import { countCharacters, countWords } from "@/lib/format";

export const WORDS_PER_MINUTE = 200;

/** Memecah transkrip berdasarkan baris kosong; newline tunggal tetap dipertahankan. */
export function splitTranscriptParagraphs(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n[\t ]*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function getTranscriptStats(text: string) {
  const words = countWords(text);
  const paragraphs = splitTranscriptParagraphs(text).length;

  return {
    words,
    characters: countCharacters(text),
    paragraphs,
    readingMinutes: words === 0 ? 0 : Math.ceil(words / WORDS_PER_MINUTE),
  };
}
