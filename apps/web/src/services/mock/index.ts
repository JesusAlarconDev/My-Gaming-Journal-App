import type { Services } from '../types';
import { MOCK_ENTRIES } from './data/entries';
import { MOCK_GAMES } from './data/games';
import { MOCK_USER } from './data/users';
import { respond } from './delay';

export function createMockServices({ delayMs = 0 }: { delayMs?: number } = {}): Services {
  return {
    games: {
      listGames: () => respond(MOCK_GAMES, delayMs),
      getGame: (id) =>
        respond(
          MOCK_GAMES.find((game) => game.id === id),
          delayMs,
        ),
    },
    journal: {
      listEntries: () =>
        respond(
          [...MOCK_ENTRIES].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
          delayMs,
        ),
    },
    users: {
      getCurrentUser: () => respond(MOCK_USER, delayMs),
    },
  };
}
