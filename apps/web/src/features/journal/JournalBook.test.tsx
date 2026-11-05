import { fireEvent, render, screen } from '@testing-library/react';
import { JournalBook } from './JournalBook';
import { COMPLETE_ENTRY, makeItem } from './testItems';

const items = [
  makeItem({ ...COMPLETE_ENTRY, id: 'e1' }, { id: 'g1', title: 'Hades' }),
  makeItem({ ...COMPLETE_ENTRY, id: 'e2' }, { id: 'g2', title: 'Celeste' }),
  makeItem({ ...COMPLETE_ENTRY, id: 'e3' }, { id: 'g3', title: 'Hollow Knight' }),
];

const cover = () => screen.getByRole('button', { name: /Abrir el diario/ });
const openBook = () => fireEvent.click(cover());

describe('JournalBook open and close', () => {
  it('starts closed: the cover is shown and no page is', () => {
    render(<JournalBook items={items} layout="spread" />);
    expect(cover()).toHaveAccessibleName('My Gaming Journal Abrir el diario');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cerrar el diario' })).not.toBeInTheDocument();
  });

  it('opens on the most recent entry showing both pages in a spread', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    expect(screen.getByRole('region', { name: 'Primera página de Hades' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Segunda página de Hades' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Abrir el diario/ })).not.toBeInTheDocument();
  });

  it('opens on a single page in the single layout', () => {
    render(<JournalBook items={items} layout="single" />);
    openBook();
    expect(screen.getByRole('region', { name: 'Primera página de Hades' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /Segunda página/ })).not.toBeInTheDocument();
  });

  it('exposes a single entry to assistive technology', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(screen.queryByText('Celeste')).not.toBeInTheDocument();
    expect(screen.queryByText('Hollow Knight')).not.toBeInTheDocument();
  });

  it('closes with an X button in the top-right corner of the pages', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    const close = screen.getByRole('button', { name: 'Cerrar el diario' });
    expect(close).toHaveClass('absolute', 'top-3', 'right-3');
    expect(close.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(close.parentElement).toContainElement(
      screen.getByRole('group', { name: /Entrada 1 de 3/ }),
    );
    expect(screen.getAllByRole('button', { name: 'Cerrar el diario' })).toHaveLength(1);
  });

  it('closes back to the cover', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar el diario' }));
    expect(cover()).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('can be reopened after closing, on the first entry', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar el diario' }));
    openBook();
    expect(screen.getByRole('region', { name: 'Primera página de Hades' })).toBeInTheDocument();
  });

  it('starts closed again on a fresh mount, like after a reload', () => {
    const first = render(<JournalBook items={items} layout="spread" />);
    openBook();
    first.unmount();
    render(<JournalBook items={items} layout="spread" />);
    expect(cover()).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});

describe('JournalBook focus', () => {
  it('moves focus to the entry when the book opens, and names it for screen readers', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    const entry = screen.getByRole('group', { name: 'Entrada 1 de 3: Hades' });
    expect(entry).toHaveFocus();
  });

  it('describes the page too in the single layout', () => {
    render(<JournalBook items={items} layout="single" />);
    openBook();
    expect(
      screen.getByRole('group', { name: 'Entrada 1 de 3, página 1 de 2: Hades' }),
    ).toHaveFocus();
  });

  it('returns focus to the cover when the book closes', () => {
    render(<JournalBook items={items} layout="spread" />);
    openBook();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar el diario' }));
    expect(cover()).toHaveFocus();
  });

  it('does not steal focus on the first render', () => {
    render(<JournalBook items={items} layout="spread" />);
    expect(cover()).not.toHaveFocus();
  });
});

describe('JournalBook edge cases', () => {
  it('does not crash when opened with no entries', () => {
    render(<JournalBook items={[]} layout="spread" />);
    openBook();
    expect(screen.getByRole('button', { name: 'Cerrar el diario' })).toBeInTheDocument();
  });

  it('opens an entry with the minimum data', () => {
    render(<JournalBook items={[makeItem()]} layout="spread" />);
    openBook();
    expect(screen.getByRole('heading', { level: 2, name: 'Hades' })).toBeInTheDocument();
  });

  it('passes the narrow-book mode to the captures', () => {
    const withImages = [makeItem({ images: ['/a.png', '/b.png', '/c.png'] })];
    render(<JournalBook items={withImages} layout="single" compactCaptures />);
    openBook();
    expect(screen.getByText('Captura 1 de 3')).toBeInTheDocument();
  });
});

describe('JournalBook width', () => {
  it('caps and centers the book so pages stay readable on very wide screens', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    expect(container.firstElementChild).toHaveClass('mx-auto', 'w-full', 'max-w-5xl');
  });
});
