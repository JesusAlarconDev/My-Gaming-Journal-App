export const es = {
  app: {
    name: 'Game Journal',
    tagline: 'Tu diario personal de los mundos que has jugado',
    skipToContent: 'Saltar al contenido',
    greeting: 'Hola, {name}',
  },
  nav: {
    label: 'Navegación principal',
    dashboard: 'Inicio',
    journal: 'Diario',
    collection: 'Mi colección',
    profile: 'Mi perfil',
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'Esta página no existe en tu diario.',
    backHome: 'Volver al inicio',
  },
  common: {
    loading: 'Cargando…',
    error: 'No se pudo cargar la información. Inténtalo de nuevo más tarde.',
  },
  format: {
    minutes: '{minutes} min',
    hours: '{hours} h',
    hoursMinutes: '{hours} h {minutes} min',
    noValue: '—',
  },
  stats: {
    title: 'Resumen',
    registered: 'Juegos registrados',
    playing: 'Jugando ahora',
    completed: 'Completados',
    playtime: 'Tiempo jugado',
    averageRating: 'Valoración media',
  },
  dashboard: {
    description: 'Un vistazo a lo último que has vivido',
    recentTitle: 'Últimas entradas',
    viewAll: 'Ver todo el diario',
    emptyTitle: 'Aún no hay recuerdos',
    emptyDescription: 'Cuando registres un juego, aparecerá aquí.',
  },
  journal: {
    description: 'Tus recuerdos, juego a juego',
    emptyTitle: 'Tu diario está vacío',
    emptyDescription: 'Cuando registres un juego, aparecerá aquí.',
    loggedOn: 'Registrado el {date}',
    playtime: '{time} jugadas',
    noReview: 'Sin reseña todavía',
    liked: 'Te gustó:',
    disliked: 'No te gustó:',
  },
  collection: {
    description: 'Todos tus juegos, como fotos pegadas en un álbum',
    emptyTitle: 'Tu colección está vacía',
    emptyDescription: 'Los juegos que añadas se mostrarán aquí.',
  },
  profile: {
    description: 'Quién eres como jugador',
    memberSince: 'Contigo desde el {date}',
    statsTitle: 'Tus números',
  },
  status: {
    playing: 'Jugando',
    completed: 'Completado',
    backlog: 'Pendiente',
    abandoned: 'Abandonado',
    on_hold: 'En pausa',
  },
  rating: {
    label: '{value} de 5 estrellas',
    none: 'Sin valoración',
  },
  game: {
    coverAlt: 'Portada de {title}',
  },
} as const;
