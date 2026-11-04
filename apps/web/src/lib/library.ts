import type { Game, JournalEntry } from '@game-journal/contracts';

export interface JournalItem {
  game: Game;
  entry: JournalEntry;
}

export interface CollectionItem {
  game: Game;
  entry?: JournalEntry;
}

export interface JournalStats {
  registered: number;
  playing: number;
  completed: number;
  totalPlaytimeMinutes: number;
  /** Mean of the entries that have a rating; `undefined` when none do. */
  averageRating?: number;
}

export interface Library {
  /** Every game, with its entry when one exists. */
  collection: CollectionItem[];
  /** Entries joined with their game, newest first. Entries pointing to an unknown game are skipped. */
  journal: JournalItem[];
  stats: JournalStats;
}

export function computeStats(entries: JournalEntry[]): JournalStats {
  const ratings = entries.flatMap((entry) => (entry.rating ? [entry.rating] : []));
  return {
    registered: entries.length,
    playing: entries.filter((entry) => entry.status === 'playing').length,
    completed: entries.filter((entry) => entry.status === 'completed').length,
    totalPlaytimeMinutes: entries.reduce((sum, entry) => sum + (entry.playtimeMinutes ?? 0), 0),
    averageRating: ratings.length
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : undefined,
  };
}

export function buildLibrary(games: Game[], entries: JournalEntry[]): Library {
  const entryByGame = new Map(entries.map((entry) => [entry.gameId, entry]));
  const gameById = new Map(games.map((game) => [game.id, game]));

  const journal = entries
    .flatMap((entry) => {
      const game = gameById.get(entry.gameId);
      return game ? [{ game, entry }] : [];
    })
    .sort((a, b) => b.entry.loggedAt.localeCompare(a.entry.loggedAt));

  return {
    collection: games.map((game) => ({ game, entry: entryByGame.get(game.id) })),
    journal,
    stats: computeStats(journal.map((item) => item.entry)),
  };
}
