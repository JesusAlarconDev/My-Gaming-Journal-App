import { createMockServices } from './mock';

export type { GameService, JournalService, Services, UserService } from './types';

/** Active service implementation. Swap for HTTP services in the backend phase. */
export const services = createMockServices({ delayMs: 250 });
