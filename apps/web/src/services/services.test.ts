import { RATING_CATEGORIES } from '@game-journal/contracts';
import { createMockServices } from './mock';

const services = createMockServices();

describe('mock services', () => {
  it('lists games', async () => {
    const games = await services.games.listGames();
    expect(games.length).toBeGreaterThanOrEqual(6);
  });

  it('gets a game by id and returns undefined when missing', async () => {
    expect((await services.games.getGame('game-hades'))?.title).toBe('Hades');
    expect(await services.games.getGame('nope')).toBeUndefined();
  });

  it('lists entries newest first', async () => {
    const entries = await services.journal.listEntries();
    const dates = entries.map((e) => e.loggedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('has at most one entry per game and references existing games', async () => {
    const [entries, games] = await Promise.all([
      services.journal.listEntries(),
      services.games.listGames(),
    ]);
    const gameIds = entries.map((e) => e.gameId);
    expect(new Set(gameIds).size).toBe(gameIds.length);
    gameIds.forEach((id) => expect(games.some((g) => g.id === id)).toBe(true));
  });

  it('covers edge cases: entry without rating and without dates', async () => {
    const entries = await services.journal.listEntries();
    expect(entries.some((e) => e.rating === undefined)).toBe(true);
    expect(entries.some((e) => e.startedAt === undefined)).toBe(true);
  });

  it('covers the journal book fields: free texts, category ratings and suggested games', async () => {
    const entries = await services.journal.listEntries();
    const complete = (e: (typeof entries)[number]) =>
      RATING_CATEGORIES.every((category) => e.categoryRatings?.[category] !== undefined);

    expect(entries.filter(complete)).toHaveLength(3);
    expect(
      entries.filter(
        (e) => e.categoryRatings && !complete(e) && Object.keys(e.categoryRatings).length,
      ),
    ).toHaveLength(1);
    expect(entries.filter((e) => e.categoryRatings === undefined)).toHaveLength(2);

    // At least one entry has an empty or missing liked/disliked text.
    expect(entries.some((e) => !e.likedText || !e.dislikedText)).toBe(true);
    expect(entries.some((e) => e.likedText && e.dislikedText)).toBe(true);
  });

  it('suggests three sample games in most entries and none in at least one', async () => {
    const entries = await services.journal.listEntries();
    const withSuggestions = entries.filter((e) => e.suggestedGames?.length);
    expect(withSuggestions.length).toBeGreaterThan(entries.length / 2);
    withSuggestions.forEach((e) => expect(e.suggestedGames).toHaveLength(3));
    expect(entries.some((e) => !e.suggestedGames?.length)).toBe(true);
  });

  it('has no captures in the mock data, so the book shows placeholders', async () => {
    const entries = await services.journal.listEntries();
    entries.forEach((e) => expect(e.images).toEqual([]));
  });

  it('does not expose mutable mock data', async () => {
    const first = await services.games.listGames();
    first[0]!.title = 'Changed';
    const second = await services.games.listGames();
    expect(second[0]!.title).not.toBe('Changed');
  });

  it('returns the current user', async () => {
    expect((await services.users.getCurrentUser()).id).toBe('user-1');
  });
});
