import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
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
  const cover = () => screen.findByRole('button', { name: /Abrir el diario/ });

  it('shows the closed book with its cover, a single h1 and no entries yet', async () => {
    renderView(<JournalPage />);
    expect(await cover()).toHaveAccessibleName('My Gaming Journal Abrir el diario');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Diario');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('opens on the most recent entry, with its pages from the service', async () => {
    renderView(<JournalPage />);
    fireEvent.click(await cover());
    expect(screen.getByRole('heading', { level: 2, name: 'Stardew Valley' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Primera página de Stardew Valley' })).toBeVisible();
    expect(screen.getByText('Entrada 1 de 6 · Página 1 de 2')).toBeInTheDocument();
  });

  it('turns through the pages of the journal and reaches the oldest entry', async () => {
    renderView(<JournalPage />);
    fireEvent.click(await cover());
    const next = () => screen.getByRole('button', { name: 'Página siguiente' });
    // Six entries, two pages each; a narrow book in tests shows one page at a time.
    for (let i = 0; i < 11; i++) fireEvent.click(next());
    expect(screen.getByRole('region', { name: 'Segunda página de Disco Elysium' })).toBeVisible();
    expect(next()).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles an entry without rating, review, texts, categories or suggestions', async () => {
    renderView(<JournalPage />);
    fireEvent.click(await cover());
    const next = () => screen.getByRole('button', { name: 'Página siguiente' });
    for (let i = 0; i < 10; i++) fireEvent.click(next());
    // Disco Elysium: status only.
    expect(screen.getByRole('img', { name: 'Sin valoración' })).toBeInTheDocument();
    expect(screen.getByText('Sin reseña todavía')).toBeInTheDocument();
    fireEvent.click(next());
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getAllByText('Sin calificar')).toHaveLength(4);
    expect(screen.queryByText('Juegos que podrían gustarte')).not.toBeInTheDocument();
  });

  it('shows an empty book with a message when the journal is empty', async () => {
    vi.spyOn(services.journal, 'listEntries').mockResolvedValueOnce([]);
    renderView(<JournalPage />);
    fireEvent.click(await cover());
    expect(screen.getByText('Tu diario está vacío')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
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
