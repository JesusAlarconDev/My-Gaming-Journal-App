const TONES = [
  'bg-sage/40 text-sage-deep',
  'bg-rose/40 text-rose-deep',
  'bg-orange/30 text-orange-deep',
  'bg-blue/40 text-blue-deep',
] as const;

function toneFor(title: string): string {
  let hash = 0;
  for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length]!;
}

/** Generated cover for games without an image. Decorative: the title is always shown nearby. */
export function CoverPlaceholder({ title }: { title: string }) {
  const initial = title.trim().charAt(0).toUpperCase() || '?';
  return (
    <div
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center font-display text-6xl ${toneFor(title)}`}
    >
      {initial}
    </div>
  );
}
