import { StatTile } from '@/components/ui/StatTile';
import { formatDecimal, formatPlaytime } from '@/lib/format';
import { useT } from '@/lib/i18n';
import type { JournalStats } from '@/lib/library';

/** Summary figures shared by the Dashboard and Profile views. */
export function StatsGrid({
  stats,
  includeAverageRating = false,
}: {
  stats: JournalStats;
  includeAverageRating?: boolean;
}) {
  const t = useT();
  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile label={t('stats.registered')} value={String(stats.registered)} />
      <StatTile label={t('stats.playing')} value={String(stats.playing)} />
      <StatTile label={t('stats.completed')} value={String(stats.completed)} />
      <StatTile label={t('stats.playtime')} value={formatPlaytime(stats.totalPlaytimeMinutes)} />
      {includeAverageRating && (
        <StatTile
          label={t('stats.averageRating')}
          value={
            stats.averageRating === undefined
              ? t('format.noValue')
              : formatDecimal(stats.averageRating)
          }
        />
      )}
    </dl>
  );
}
