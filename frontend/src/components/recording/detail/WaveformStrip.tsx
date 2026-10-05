const BAR_COUNT = 44;
const MIN_HEIGHT = 0.14;

interface WaveformStripProps {
  /** Dipakai sebagai seed agar tinggi bar deterministik (aman untuk SSR). */
  seed: string;
  isActive?: boolean;
}

function hashSeed(seed: string): number {
  let hash = 7;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 2147483647;
  }

  return hash === 0 ? 7 : hash;
}

function buildBarHeights(seed: string, count: number): number[] {
  let state = hashSeed(seed);
  const heights: number[] = [];

  for (let index = 0; index < count; index += 1) {
    state = (state * 1103515245 + 12345) % 2147483648;

    const noise = (state % 1000) / 1000;
    const envelope = Math.sin((Math.PI * (index + 0.5)) / count);
    const height = 0.16 + noise * 0.52 + envelope * 0.3;

    heights.push(Math.min(1, Math.max(MIN_HEIGHT, height)));
  }

  return heights;
}

export default function WaveformStrip({
  seed,
  isActive = true,
}: WaveformStripProps) {
  const heights = buildBarHeights(seed, BAR_COUNT);

  return (
    <div
      aria-hidden="true"
      className="relative flex h-20 items-end gap-0.75 overflow-hidden [mask-[linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]"
    >
      {isActive && (
        <span className="pointer-events-none absolute inset-y-0 left-0 w-0.5 rounded-full bg-(--rsm-accent)] opacity-70 blur-[1px] animate-rsm-sweep" />
      )}

      {heights.map((height, index) => (
        <span
          key={`${seed}-${index}`}
          className="rsm-eq-bar flex-1 rounded-full animate-rsm-eq"
          style={{
            height: `${Math.round(height * 100)}%`,
            animationDelay: `${(index % 11) * 90}ms`,
            animationDuration: `${1050 + (index % 7) * 130}ms`,
            backgroundColor:
              index % 3 === 0 ? "var(--rsm-accent)" : "var(--rsm-ink-mute)",
            opacity: index % 3 === 0 ? 0.85 : 0.45,
          }}
        />
      ))}
    </div>
  );
}
