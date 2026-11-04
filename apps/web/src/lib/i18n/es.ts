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
  placeholder: {
    title: 'En construcción',
    description: 'Esta vista se completará en los siguientes pasos.',
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
