import type { JournalEntry } from '@game-journal/contracts';

const base = { userId: 'user-1', images: [] as string[] };

export const MOCK_ENTRIES: JournalEntry[] = [
  {
    ...base,
    id: 'entry-1',
    gameId: 'game-stardew',
    status: 'playing',
    rating: 5,
    review: 'Mi refugio de cada noche. Regar, pescar y charlar con el pueblo me relaja muchísimo.',
    loggedAt: '2026-10-28T21:00:00.000Z',
    startedAt: '2026-09-02T00:00:00.000Z',
    playtimeMinutes: 4380,
    likedAspects: ['Ritmo relajado', 'Música', 'Personajes'],
    dislikedAspects: ['Inventario limitado'],
  },
  {
    ...base,
    id: 'entry-2',
    gameId: 'game-zelda-botw',
    status: 'completed',
    rating: 5,
    review:
      'Recuerdo la primera vez que crucé el Gran Valle de Hyrule y no quise volver a seguir la historia. ' +
      'Cada colina escondía algo: un santuario, un korok, un paisaje que merecía una captura. ' +
      'Las armas se rompen demasiado rápido, pero eso me obligó a improvisar y a recordar partidas únicas. ' +
      'El final me dejó con ganas de volver a explorar todo desde cero, solo por el placer de perderme.',
    loggedAt: '2026-10-15T18:30:00.000Z',
    startedAt: '2026-07-01T00:00:00.000Z',
    completedAt: '2026-10-14T00:00:00.000Z',
    playtimeMinutes: 9120,
    likedAspects: ['Exploración', 'Libertad', 'Banda sonora'],
    dislikedAspects: ['Armas frágiles'],
  },
  {
    ...base,
    id: 'entry-3',
    gameId: 'game-hades',
    status: 'completed',
    rating: 4,
    review: 'Morir nunca se sintió tan bien. Cada intento avanza la historia.',
    loggedAt: '2026-09-20T22:10:00.000Z',
    startedAt: '2026-08-10T00:00:00.000Z',
    completedAt: '2026-09-19T00:00:00.000Z',
    playtimeMinutes: 3600,
    likedAspects: ['Narrativa', 'Combate'],
    dislikedAspects: [],
  },
  {
    ...base,
    id: 'entry-4',
    gameId: 'game-celeste',
    status: 'on_hold',
    rating: 4,
    loggedAt: '2026-08-05T20:00:00.000Z',
    startedAt: '2026-08-01T00:00:00.000Z',
    playtimeMinutes: 420,
    likedAspects: ['Banda sonora'],
    dislikedAspects: ['Dificultad de algunas pantallas'],
  },
  {
    ...base,
    id: 'entry-5',
    gameId: 'game-hollow',
    status: 'abandoned',
    review: 'Precioso, pero me perdí y no supe hacia dónde seguir.',
    loggedAt: '2026-06-18T19:00:00.000Z',
    playtimeMinutes: 600,
    likedAspects: ['Ambientación'],
    dislikedAspects: ['Falta de guía'],
  },
  {
    ...base,
    id: 'entry-6',
    gameId: 'game-disco',
    status: 'backlog',
    loggedAt: '2026-05-02T12:00:00.000Z',
    likedAspects: [],
    dislikedAspects: [],
  },
];
