import { BookHeart, Gamepad2, Sparkles } from 'lucide-react';
import { Sticker } from '@/components/decor/Sticker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { PolaroidCard, type Tilt } from '@/components/ui/PolaroidCard';
import { useAsync } from '@/hooks/useAsync';
import { services } from '@/services';

const TILTS: Tilt[] = [-1, 1, 0, 2, -2];

const loadShowcase = () =>
  Promise.all([services.games.listGames(), services.journal.listEntries()]);

/** Temporary Design System preview. Replaced by the router and layout in block F. */
export function App() {
  const state = useAsync(loadShowcase);

  return (
    <main className="mx-auto max-w-5xl p-6 sm:p-10">
      <div className="relative">
        <PageHeader
          title="Game Journal"
          description="Tu diario personal de los mundos que has jugado"
          action={<Button>Nueva entrada</Button>}
        />
        <Sticker tone="rose" className="absolute -top-4 right-2 hidden sm:inline-flex">
          <BookHeart />
        </Sticker>
      </div>

      {state.status === 'loading' && <p aria-live="polite">Cargando…</p>}
      {state.status === 'error' && <p role="alert">No se pudo cargar el diario.</p>}
      {state.status === 'success' && (
        <>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {state.data[0].map((game, i) => {
              const entry = state.data[1].find((e) => e.gameId === game.id);
              return (
                <li key={game.id}>
                  <PolaroidCard
                    title={game.title}
                    subtitle={game.genres.join(' · ')}
                    status={entry?.status}
                    rating={entry?.rating}
                    tilt={TILTS[i % TILTS.length]}
                  />
                </li>
              );
            })}
          </ul>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <h2 className="font-display text-xl">Una tarjeta</h2>
              <p className="mt-1 text-cocoa-soft">Superficie tipo papel para agrupar contenido.</p>
              <div className="mt-4 flex gap-2">
                <Button>Primario</Button>
                <Button variant="secondary">Secundario</Button>
                <Button variant="ghost">Fantasma</Button>
              </div>
            </Card>
            <EmptyState
              icon={<Gamepad2 size={32} />}
              title="Aún no hay recuerdos aquí"
              description="Cuando registres un juego, aparecerá en esta página."
              action={
                <Button variant="secondary">
                  <Sparkles size={16} aria-hidden="true" /> Registrar un juego
                </Button>
              }
            />
          </div>
        </>
      )}
    </main>
  );
}
