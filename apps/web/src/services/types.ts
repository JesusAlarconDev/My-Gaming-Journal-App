import type { Game, JournalEntry, User } from '@game-journal/contracts';

export interface GameService {
  listGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
}

export interface JournalService {
  /** Entries sorted by `loggedAt`, newest first. */
  listEntries(): Promise<JournalEntry[]>;
}

export interface UserService {
  getCurrentUser(): Promise<User>;
}

export interface Services {
  games: GameService;
  journal: JournalService;
  users: UserService;
}
