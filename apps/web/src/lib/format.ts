import { t } from './i18n';

const dateFormat = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const numberFormat = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

/** Formats an ISO date as "28 oct 2026" (UTC, so the result doesn't depend on the viewer's timezone). */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** Formats minutes as "5 min", "3 h" or "2 h 30 min". */
export function formatPlaytime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) return t('format.minutes', { minutes });
  if (minutes === 0) return t('format.hours', { hours });
  return t('format.hoursMinutes', { hours, minutes });
}

export function formatDecimal(value: number): string {
  return numberFormat.format(value);
}
