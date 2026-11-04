import type { Game, JournalEntry } from '@game-journal/contracts';
import { formatDate, formatPlaytime } from './format';
import { buildLibrary, computeStats } from './library';

const game = (id: string): Game => ({ id, title: id, platforms: [], genres: [] });
const entry = (id: string, gameId: string, extra: Partial<JournalEntry> = {}): JournalEntry => ({
  id,
  userId: 'u',
  gameId,
  status: 'backlog',
  loggedAt: '2026-01-01T00:00:00.000Z',
  images: [],
  ...extra,
});

describe('computeStats', () => {
  it('returns zeros and no average for an empty list', () => {
    expect(computeStats([])).toEqual({
      registered: 0,
      playing: 0,
      completed: 0,
      totalPlaytimeMinutes: 0,
      averageRating: undefined,
    });
  });

  it('counts statuses, sums playtime and averages only rated entries', () => {
    const stats = computeStats([
      entry('1', 'a', { status: 'playing', rating: 5, playtimeMinutes: 60 }),
      entry('2', 'b', { status: 'completed', rating: 4, playtimeMinutes: 30 }),
      entry('3', 'c', { status: 'completed' }),
    ]);
    expect(stats).toEqual({
      registered: 3,
      playing: 1,
      completed: 2,
      totalPlaytimeMinutes: 90,
      averageRating: 4.5,
    });
  });
});

describe('buildLibrary', () => {
  const games = [game('a'), game('b'), game('c')];

  it('lists every game in the collection and attaches its entry when present', () => {
    const library = buildLibrary(games, [entry('1', 'b')]);
    expect(library.collection.map((c) => [c.game.id, c.entry?.id])).toEqual([
      ['a', undefined],
      ['b', '1'],
      ['c', undefined],
    ]);
  });

  it('orders the journal newest first', () => {
    const library = buildLibrary(games, [
      entry('old', 'a', { loggedAt: '2026-01-01T00:00:00.000Z' }),
      entry('new', 'b', { loggedAt: '2026-06-01T00:00:00.000Z' }),
    ]);
    expect(library.journal.map((j) => j.entry.id)).toEqual(['new', 'old']);
  });

  it('skips entries that point to an unknown game', () => {
    const library = buildLibrary(games, [entry('1', 'zzz'), entry('2', 'a')]);
    expect(library.journal.map((j) => j.entry.id)).toEqual(['2']);
    expect(library.stats.registered).toBe(1);
  });

  it('handles no data at all', () => {
    const library = buildLibrary([], []);
    expect(library.collection).toEqual([]);
    expect(library.journal).toEqual([]);
  });
});

describe('format', () => {
  it('formats playtime', () => {
    expect(formatPlaytime(0)).toBe('0 min');
    expect(formatPlaytime(45)).toBe('45 min');
    expect(formatPlaytime(120)).toBe('2 h');
    expect(formatPlaytime(150)).toBe('2 h 30 min');
  });

  it('formats dates in UTC', () => {
    expect(formatDate('2026-10-28T23:30:00.000Z')).toMatch(/^28 oct\.? 2026$/);
  });
});
