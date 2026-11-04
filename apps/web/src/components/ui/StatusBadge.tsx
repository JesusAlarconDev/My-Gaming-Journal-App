import type { GameStatus } from '@game-journal/contracts';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';

const tones: Record<GameStatus, string> = {
  playing: 'bg-orange/20 text-orange-deep',
  completed: 'bg-sage/25 text-sage-deep',
  backlog: 'bg-blue/25 text-blue-deep',
  abandoned: 'bg-rose/25 text-rose-deep',
  on_hold: 'bg-cocoa/10 text-cocoa-soft',
};

export function StatusBadge({ status, className }: { status: GameStatus; className?: string }) {
  const t = useT();
  return (
    <span
      className={cx(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[status],
        className,
      )}
    >
      {t(`status.${status}`)}
    </span>
  );
}
