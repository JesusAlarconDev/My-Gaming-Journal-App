import { Star } from 'lucide-react';
import { RATING_CATEGORIES, type CategoryRatings as Ratings } from '@game-journal/contracts';
import { useT } from '@/lib/i18n';

const STARS = [1, 2, 3, 4, 5] as const;

/** Gameplay, story, music and graphics ratings. A missing category reads "Sin calificar". */
export function CategoryRatings({ ratings }: { ratings?: Ratings }) {
  const t = useT();
  return (
    <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5">
      {RATING_CATEGORIES.map((category) => {
        const value = ratings?.[category];
        return (
          <div key={category} className="contents">
            <dt className="text-sm font-semibold">{t(`book.categories.${category}`)}</dt>
            <dd>
              {value ? (
                <span
                  role="img"
                  aria-label={t('rating.label', { value })}
                  className="inline-flex gap-0.5"
                >
                  {STARS.map((n) => (
                    <Star
                      key={n}
                      aria-hidden="true"
                      size={16}
                      strokeWidth={2}
                      className={
                        n <= value ? 'fill-gold text-gold-deep' : 'fill-none text-star-gray'
                      }
                    />
                  ))}
                </span>
              ) : (
                <span className="text-sm text-cocoa-soft italic">{t('book.unrated')}</span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
