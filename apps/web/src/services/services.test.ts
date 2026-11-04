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
