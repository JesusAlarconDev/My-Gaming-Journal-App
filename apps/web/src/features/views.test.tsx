import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CollectionPage } from './collection/CollectionPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { JournalPage } from './journal/JournalPage';
import { ProfilePage } from './profile/ProfilePage';
import { services } from '@/services';

function renderView(view: React.ReactElement) {
  return render(<MemoryRouter>{view}</MemoryRouter>);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each([
  ['Dashboard', <DashboardPage />],
  ['Journal', <JournalPage />],
  ['Collection', <CollectionPage />],
])('%s states', (_name, view) => {
  it('shows a loading state, then content', async () => {
    renderView(view);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando…');
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows an error state when the service fails', async () => {
    vi.spyOn(services.games, 'listGames').mockRejectedValueOnce(new Error('boom'));
    renderView(view);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});

describe('Dashboard', () => {
  it('shows summary figures and the three most recent entries', async () => {
    renderView(<DashboardPage />);
    const summary = await screen.findByRole('region', { name: 'Resumen' });
    const figure = (label: string) =>
      within(summary).getByText(label).closest('div')!.querySelector('dd')!.textContent;
    expect(figure('Juegos registrados')).toBe('6');
    expect(figure('Jugando ahora')).toBe('1');
    expect(figure('Completados')).toBe('2');

    const recent = screen.getByRole('region', { name: 'Últimas entradas' });
    const titles = within(recent)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual(['Stardew Valley', 'The Legend of Zelda: Breath of the Wild', 'Hades']);
    expect(screen.getByRole('link', { name: 'Ver todo el diario' })).toHaveAttribute(
      'href',
      '/journal',
    );
  });

  it('shows an empty state when there are no entries', async () => {
    vi.spyOn(services.journal, 'listEntries').mockResolvedValueOnce([]);
    renderView(<DashboardPage />);
    expect(await screen.findByText('Aún no hay recuerdos')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Ver todo el diario' })).not.toBeInTheDocument();
  });
});

describe('Journal', () => {
  it('lists all entries newest first, handling missing rating, review and long text', async () => {
    renderView(<JournalPage />);
    const items = await screen.findAllByRole('article');
    expect(items).toHaveLength(6);
    expect(within(items[0]!).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Stardew Valley',
    );
    // Hollow Knight: no rating. Disco Elysium: no review.
    const hollow = items.find((i) => within(i).queryByText('Hollow Knight'))!;
    expect(within(hollow).getByRole('img', { name: 'Sin valoración' })).toBeInTheDocument();
    const disco = items.find((i) => within(i).queryByText('Disco Elysium'))!;
    expect(within(disco).getByText('Sin reseña todavía')).toBeInTheDocument();
    // Long review remains fully in the DOM; truncation is visual.
    expect(screen.getByText(/volver a explorar todo desde cero/)).toBeInTheDocument();
  });

  it('shows an empty state when the journal is empty', async () => {
    vi.spyOn(services.journal, 'listEntries').mockResolvedValueOnce([]);
    renderView(<JournalPage />);
    expect(await screen.findByText('Tu diario está vacío')).toBeInTheDocument();
  });
});

describe('Collection', () => {
  it('shows every game as a card, with status only where an entry exists', async () => {
    renderView(<CollectionPage />);
    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(7);
    const longTitle = cards.find((c) => within(c).queryByText(/Anniversary Edition/))!;
    expect(within(longTitle).queryByText('Jugando')).not.toBeInTheDocument();
    const stardew = cards.find((c) => within(c).queryByText('Stardew Valley'))!;
    expect(within(stardew).getByText('Jugando')).toBeInTheDocument();
  });

  it('shows an empty state when there are no games', async () => {
    vi.spyOn(services.games, 'listGames').mockResolvedValueOnce([]);
    renderView(<CollectionPage />);
    expect(await screen.findByText('Tu colección está vacía')).toBeInTheDocument();
  });
});

describe('Profile', () => {
  it('shows the user and their stats', async () => {
    renderView(<ProfilePage />);
    expect(await screen.findByRole('heading', { level: 2, name: 'Alex' })).toBeInTheDocument();
    expect(screen.getByText(/Contigo desde el 12 mar/)).toBeInTheDocument();
    const stats = await screen.findByRole('region', { name: 'Tus números' });
    const figure = (label: string) =>
      within(stats).getByText(label).closest('div')!.querySelector('dd')!.textContent;
    expect(figure('Juegos registrados')).toBe('6');
    expect(figure('Tiempo jugado')).toBe('302 h');
    expect(figure('Valoración media')).toBe('4,5');
  });

  it('shows an error state when the user cannot be loaded', async () => {
    vi.spyOn(services.users, 'getCurrentUser').mockRejectedValueOnce(new Error('boom'));
    renderView(<ProfilePage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
