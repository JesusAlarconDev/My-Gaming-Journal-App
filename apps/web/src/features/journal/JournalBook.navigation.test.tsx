import { fireEvent, render, screen } from '@testing-library/react';
import { buildLibrary } from '@/lib/library';
import { createMockServices } from '@/services/mock';
import { JournalBook } from './JournalBook';
import { COMPLETE_ENTRY, makeItem } from './testItems';

const items = [
  makeItem({ ...COMPLETE_ENTRY, id: 'e1' }, { id: 'g1', title: 'Hades' }),
  makeItem({ ...COMPLETE_ENTRY, id: 'e2' }, { id: 'g2', title: 'Celeste' }),
  makeItem({ ...COMPLETE_ENTRY, id: 'e3' }, { id: 'g3', title: 'Hollow Knight' }),
];

const cover = () => screen.getByRole('button', { name: /Abrir el diario/ });
const openBook = () => fireEvent.click(cover());
const closeBook = () => fireEvent.click(screen.getByRole('button', { name: 'Cerrar el diario' }));
const nextEntry = () => screen.getByRole('button', { name: 'Entrada siguiente' });
const previousEntry = () => screen.getByRole('button', { name: 'Entrada anterior' });
const nextPage = () => screen.getByRole('button', { name: 'Página siguiente' });
const liveRegion = () => document.querySelector('[aria-live="polite"]')!;
const entryTitle = () => screen.getByRole('heading', { level: 2 }).textContent;

async function mockItems() {
  const services = createMockServices();
  const [games, entries] = await Promise.all([
    services.games.listGames(),
    services.journal.listEntries(),
  ]);
  return buildLibrary(games, entries).journal;
}

describe('JournalBook navigation', () => {
  it('walks through every mock entry from the newest to the oldest', async () => {
    render(<JournalBook items={await mockItems()} layout="spread" />);
    openBook();
    const titles = [entryTitle()];
    while (nextEntry().getAttribute('aria-disabled') === 'false') {
      fireEvent.click(nextEntry());
      titles.push(entryTitle());
    }
    expect(titles).toEqual([
      'Stardew Valley',
      'The Legend of Zelda: Breath of the Wild',
      'Hades',
      'Celeste',
      'Hollow Knight',
      'Disco Elysium',
    ]);
    expect(screen.getByText('Entrada 6 de 6')).toBeInTheDocument();
  });

  it('goes back to the first entry and then stops', async () => {
    render(<JournalBook items={await mockItems()} layout="spread" />);
    openBook();
    fireEvent.click(nextEntry());
    fireEvent.click(nextEntry());
    expect(screen.getByText('Entrada 3 de 6')).toBeInTheDocument();
    fireEvent.click(previousEntry());
    fireEvent.click(previousEntry());
    fireEvent.click(previousEntry());
    expect(entryTitle()).toBe('Stardew Valley');
    expect(screen.getByText('Entrada 1 de 6')).toBeInTheDocument();
    expect(previousEntry()).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables previous at the start and next at the end', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    expect(previousEntry()).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(nextEntry());
    fireEvent.click(nextEntry());
    expect(nextEntry()).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(nextEntry());
    expect(screen.getByText('Entrada 3 de 3')).toBeInTheDocument();
  });

  it('with one entry, nothing can be turned in a spread', () => {
    render(<JournalBook items={[items[0]!]} layout="spread" />);
    openBook();
    expect(previousEntry()).toHaveAttribute('aria-disabled', 'true');
    expect(nextEntry()).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Entrada 1 de 1')).toBeInTheDocument();
  });

  it('in single, turns page by page: first, second, then the next entry', () => {
    render(<JournalBook items={items} layout="single" />);
    openBook();
    expect(screen.getByRole('region', { name: 'Primera página de Hades' })).toBeInTheDocument();
    fireEvent.click(nextPage());
    expect(screen.getByRole('region', { name: 'Segunda página de Hades' })).toBeInTheDocument();
    expect(screen.getByText('Entrada 1 de 3 · Página 2 de 2')).toBeInTheDocument();
    fireEvent.click(nextPage());
    expect(screen.getByRole('region', { name: 'Primera página de Celeste' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(screen.getByRole('region', { name: 'Segunda página de Hades' })).toBeInTheDocument();
  });

  it('starts again on the first entry after closing and reopening', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    fireEvent.click(nextEntry());
    fireEvent.click(nextEntry());
    closeBook();
    openBook();
    expect(entryTitle()).toBe('Hades');
    expect(screen.getByText('Entrada 1 de 3')).toBeInTheDocument();
  });

  it('keeps focus on the pressed button when turning, even at the end', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    nextEntry().focus();
    fireEvent.click(nextEntry());
    fireEvent.click(nextEntry());
    expect(nextEntry()).toHaveFocus();
    fireEvent.click(nextEntry());
    expect(nextEntry()).toHaveFocus();
  });
});

describe('JournalBook announcements', () => {
  it('has an empty polite live region when the book opens', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    expect(liveRegion()).toBeEmptyDOMElement();
  });

  it('announces the entry on each change', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    fireEvent.click(nextEntry());
    expect(liveRegion()).toHaveTextContent('Entrada 2 de 3: Celeste');
    fireEvent.click(nextEntry());
    expect(liveRegion()).toHaveTextContent('Entrada 3 de 3: Hollow Knight');
    fireEvent.click(previousEntry());
    expect(liveRegion()).toHaveTextContent('Entrada 2 de 3: Celeste');
  });

  it('announces the page too in single', () => {
    render(<JournalBook items={items} layout="single" />);
    openBook();
    fireEvent.click(nextPage());
    expect(liveRegion()).toHaveTextContent('Entrada 1 de 3, página 2 de 2: Hades');
  });

  it('does not announce when a press does nothing at the end of the book', () => {
    render(<JournalBook items={[items[0]!]} layout="spread" />);
    openBook();
    fireEvent.click(nextEntry());
    expect(liveRegion()).toBeEmptyDOMElement();
  });

  it('clears the announcement when the book is reopened', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    fireEvent.click(nextEntry());
    closeBook();
    openBook();
    expect(liveRegion()).toBeEmptyDOMElement();
  });

  it('adds no status role, which the loading state of the page relies on', () => {
    render(<JournalBook items={items} layout="spread" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    openBook();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('JournalBook keyboard', () => {
  const press = (key: string, init: KeyboardEventInit = {}) =>
    fireEvent.keyDown(screen.getByRole('group', { name: /Entrada \d de 3/ }), { key, ...init });

  it('turns to the next and previous entry with the arrow keys', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    press('ArrowRight');
    expect(entryTitle()).toBe('Celeste');
    press('ArrowRight');
    expect(entryTitle()).toBe('Hollow Knight');
    press('ArrowLeft');
    expect(entryTitle()).toBe('Celeste');
  });

  it('stops at the ends with the arrow keys too', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    press('ArrowLeft');
    expect(entryTitle()).toBe('Hades');
    press('ArrowRight');
    press('ArrowRight');
    press('ArrowRight');
    expect(entryTitle()).toBe('Hollow Knight');
  });

  it('leaves browser shortcuts alone: Alt, Ctrl, Meta and Shift with an arrow do nothing', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
      press('ArrowRight', { [modifier]: true });
    }
    expect(entryTitle()).toBe('Hades');
  });

  it('ignores other keys', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    press('ArrowDown');
    press('a');
    expect(entryTitle()).toBe('Hades');
  });

  it('works from the navigation buttons too', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    fireEvent.keyDown(nextEntry(), { key: 'ArrowRight' });
    expect(entryTitle()).toBe('Celeste');
  });

  it('turns pages with the arrow keys in single', () => {
    render(<JournalBook items={items} layout="single" />);
    openBook();
    press('ArrowRight');
    expect(screen.getByRole('region', { name: 'Segunda página de Hades' })).toBeInTheDocument();
  });

  it('does nothing while the book is closed', () => {
    render(<JournalBook items={items} layout="spread" />);
    fireEvent.keyDown(cover(), { key: 'ArrowRight' });
    expect(cover()).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});

describe('JournalBook with no entries', () => {
  it('opens on a blank page with a message and inactive controls', () => {
    render(<JournalBook items={[]} layout="spread" />);
    openBook();
    expect(screen.getByText('Tu diario está vacío')).toBeInTheDocument();
    expect(screen.getByText('Cuando registres un juego, aparecerá aquí.')).toBeInTheDocument();
    expect(previousEntry()).toHaveAttribute('aria-disabled', 'true');
    expect(nextEntry()).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('keeps the arrow keys harmless', () => {
    render(<JournalBook items={[]} layout="spread" />);
    openBook();
    fireEvent.keyDown(nextEntry(), { key: 'ArrowRight' });
    expect(screen.getByText('Tu diario está vacío')).toBeInTheDocument();
  });

  it('moves focus into the blank book and still closes', () => {
    render(<JournalBook items={[]} layout="single" />);
    openBook();
    expect(screen.getByRole('group', { name: 'Libro del diario' })).toHaveFocus();
    closeBook();
    expect(cover()).toHaveFocus();
  });

  it('shows the blank facing page only in a spread', () => {
    const spread = render(<JournalBook items={[]} layout="spread" />);
    openBook();
    expect(spread.container.querySelectorAll('.book-page')).toHaveLength(2);
    spread.unmount();
    const single = render(<JournalBook items={[]} layout="single" />);
    openBook();
    expect(single.container.querySelectorAll('.book-page')).toHaveLength(1);
  });
});
