import { act, fireEvent, render, screen } from '@testing-library/react';
import { BOOK_ANIMATION_SAFETY_MS } from '@/lib/book';
import { allowMotion } from '@/test/motion';
import { JournalBook } from './JournalBook';
import { COMPLETE_ENTRY, makeItem } from './testItems';

const items = [
  makeItem({ ...COMPLETE_ENTRY, id: 'e1' }, { id: 'g1', title: 'Hades' }),
  makeItem({ ...COMPLETE_ENTRY, id: 'e2' }, { id: 'g2', title: 'Celeste' }),
  makeItem({ ...COMPLETE_ENTRY, id: 'e3' }, { id: 'g3', title: 'Hollow Knight' }),
];

const cover = () => screen.getByRole('button', { name: /Abrir el diario/ });
const next = () => screen.getByRole('button', { name: /siguiente$/ });
const previous = () => screen.getByRole('button', { name: /anterior$/ });
const close = () => screen.getByRole('button', { name: 'Cerrar el diario' });
const entryTitle = () => screen.getByRole('heading', { level: 2 }).textContent;
const turnLayer = (container: HTMLElement) =>
  container.querySelector('.book-turn:not(.book-turn--cover)');
const coverLayer = (container: HTMLElement) => container.querySelector('.book-turn--cover');
const endCoverLayer = (container: HTMLElement) => fireEvent.animationEnd(coverLayer(container)!);
const entryGroup = () => screen.getByRole('group', { name: /Entrada \d de 3/ });
const endTurn = (container: HTMLElement) =>
  fireEvent.animationEnd(container.querySelector('.book-turn__leaf')!);

/** Opens the book and finishes the opening animation, so tests start from a settled book. */
function openAndSettle(container: HTMLElement) {
  fireEvent.click(cover());
  if (coverLayer(container)) endCoverLayer(container);
}

/** Closes the book and finishes the closing animation, so the cover is back. */
function closeAndSettle(container: HTMLElement) {
  fireEvent.click(close());
  if (coverLayer(container)) endCoverLayer(container);
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('page turn animation', () => {
  beforeEach(allowMotion);

  it('draws a turning leaf over the book in a spread when going to the next entry', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    const layer = turnLayer(container)!;
    expect(layer).toHaveAttribute('data-direction', 'next');
    expect(layer).toHaveAttribute('data-layout', 'spread');
  });

  it('turns the other way when going back', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    endTurn(container);
    fireEvent.click(previous());
    expect(turnLayer(container)).toHaveAttribute('data-direction', 'previous');
  });

  it('also turns pages in single, page by page', () => {
    const { container } = render(<JournalBook items={items} layout="single" />);
    openAndSettle(container);
    fireEvent.click(next());
    expect(turnLayer(container)).toHaveAttribute('data-layout', 'single');
    expect(screen.getByRole('region', { name: 'Segunda página de Hades' })).toBeInTheDocument();
  });

  it('already shows the new entry in the real pages while the layer is on, and only that one', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    expect(turnLayer(container)).toBeInTheDocument();
    expect(entryTitle()).toBe('Celeste');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(screen.queryByText('Hades')).not.toBeInTheDocument();
    expect(screen.getByText('Entrada 2 de 3')).toBeInTheDocument();
  });

  it('removes the layer when the leaf finishes', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    endTurn(container);
    expect(turnLayer(container)).not.toBeInTheDocument();
  });

  it('removes the layer after the safety timeout if the animation event never comes', () => {
    vi.useFakeTimers();
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    expect(turnLayer(container)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(BOOK_ANIMATION_SAFETY_MS));
    expect(turnLayer(container)).not.toBeInTheDocument();
  });

  it('ignores repeated presses while a page is turning, then accepts the next one', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    fireEvent.click(next());
    fireEvent.click(next());
    expect(entryTitle()).toBe('Celeste');
    expect(screen.getByText('Entrada 2 de 3')).toBeInTheDocument();

    endTurn(container);
    fireEvent.click(next());
    expect(entryTitle()).toBe('Hollow Knight');
  });

  it('ignores the arrow keys too while a page is turning', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.keyDown(next(), { key: 'ArrowRight' });
    fireEvent.keyDown(next(), { key: 'ArrowRight' });
    expect(entryTitle()).toBe('Celeste');
  });

  it('announces a change once, even with repeated presses', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    fireEvent.click(next());
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent(
      'Entrada 2 de 3: Celeste',
    );
  });

  it('draws no layer when a press does nothing at the end of the book', () => {
    const { container } = render(<JournalBook items={[items[0]!]} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    expect(turnLayer(container)).not.toBeInTheDocument();
  });

  it('keeps focus on the pressed button during and after the turn', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    next().focus();
    fireEvent.click(next());
    expect(next()).toHaveFocus();
    endTurn(container);
    expect(next()).toHaveFocus();
  });

  it('drops a layer that is still on when the book is closed', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    fireEvent.click(close());
    expect(turnLayer(container)).not.toBeInTheDocument();
    endCoverLayer(container);
    fireEvent.click(cover());
    endCoverLayer(container);
    fireEvent.click(next());
    expect(turnLayer(container)).toBeInTheDocument();
  });
});

describe('open and close animation', () => {
  beforeEach(allowMotion);

  it('swings the cover open over the book, which is already open and hidden underneath', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    fireEvent.click(cover());
    expect(coverLayer(container)).toHaveAttribute('data-direction', 'open');
    expect(coverLayer(container)).toHaveAttribute('aria-hidden', 'true');
    expect(coverLayer(container)).toHaveAttribute('inert');
    expect(entryTitle()).toBe('Hades');
    expect(entryGroup()).toHaveClass('book-revealing');
    expect(entryGroup()).toHaveFocus();
  });

  it('hides the close button while the cover is moving', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    fireEvent.click(cover());
    expect(screen.queryByRole('button', { name: 'Cerrar el diario' })).not.toBeInTheDocument();
    endCoverLayer(container);
    expect(close()).toBeInTheDocument();
  });

  it('removes the layer and the hiding when the cover animation ends', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    fireEvent.click(cover());
    endCoverLayer(container);
    expect(coverLayer(container)).not.toBeInTheDocument();
    expect(entryGroup()).not.toHaveClass('book-revealing');
  });

  it('removes the layer after the safety timeout', () => {
    vi.useFakeTimers();
    const { container } = render(<JournalBook items={items} layout="spread" />);
    fireEvent.click(cover());
    act(() => vi.advanceTimersByTime(BOOK_ANIMATION_SAFETY_MS));
    expect(coverLayer(container)).not.toBeInTheDocument();
  });

  it('ignores page turns while the cover is opening', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    fireEvent.click(cover());
    fireEvent.click(next());
    expect(entryTitle()).toBe('Hades');
    endCoverLayer(container);
    fireEvent.click(next());
    expect(entryTitle()).toBe('Celeste');
  });

  it('does not play any cover animation before the book has been opened', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    expect(coverLayer(container)).not.toBeInTheDocument();
  });

  it('makes the closed cover one page wide in a spread and full width in single', () => {
    const spread = render(<JournalBook items={items} layout="spread" />);
    expect(cover()).toHaveClass('book-cover--spread');
    spread.unmount();
    render(<JournalBook items={items} layout="single" />);
    expect(cover()).not.toHaveClass('book-cover--spread');
  });

  it('closes by playing the opening backwards: the book stays until the cover has closed over it', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(close());
    expect(coverLayer(container)).toHaveAttribute('data-direction', 'close');
    expect(entryGroup()).toHaveClass('book-hiding');
    expect(screen.queryByRole('button', { name: /Abrir el diario/ })).not.toBeInTheDocument();
    endCoverLayer(container);
    expect(coverLayer(container)).not.toBeInTheDocument();
    expect(cover()).toBeInTheDocument();
    expect(cover()).toHaveFocus();
  });

  it('closes after the safety timeout if the animation event never comes', () => {
    vi.useFakeTimers();
    const { container } = render(<JournalBook items={items} layout="spread" />);
    fireEvent.click(cover());
    act(() => vi.advanceTimersByTime(BOOK_ANIMATION_SAFETY_MS));
    fireEvent.click(close());
    act(() => vi.advanceTimersByTime(BOOK_ANIMATION_SAFETY_MS));
    expect(coverLayer(container)).not.toBeInTheDocument();
    expect(cover()).toBeInTheDocument();
  });

  it('ignores page turns and repeated closes while the book is closing', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(close());
    fireEvent.click(next());
    fireEvent.keyDown(entryGroup(), { key: 'ArrowRight' });
    expect(entryTitle()).toBe('Hades');
    expect(container.querySelectorAll('.book-turn--cover')).toHaveLength(1);
  });

  it('plays the opening again on every opening and starts from the first entry', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    openAndSettle(container);
    fireEvent.click(next());
    endTurn(container);
    closeAndSettle(container);
    fireEvent.click(cover());
    expect(coverLayer(container)).toHaveAttribute('data-direction', 'open');
    expect(entryTitle()).toBe('Hades');
  });
});

describe('reduced motion', () => {
  // No allowMotion(): the test setup reports `prefers-reduced-motion: reduce`.
  it('turns pages instantly, with no layer', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    fireEvent.click(cover());
    fireEvent.click(next());
    expect(entryTitle()).toBe('Celeste');
    expect(turnLayer(container)).not.toBeInTheDocument();
    fireEvent.click(next());
    expect(entryTitle()).toBe('Hollow Knight');
  });

  it('opens and closes instantly, with no layer and no cover animation', () => {
    const { container } = render(<JournalBook items={items} layout="spread" />);
    fireEvent.click(cover());
    expect(coverLayer(container)).not.toBeInTheDocument();
    expect(container.querySelector('.book-turn')).not.toBeInTheDocument();
    expect(entryGroup()).not.toHaveClass('book-revealing');
    fireEvent.click(close());
    expect(container.querySelector('.book-turn')).not.toBeInTheDocument();
    expect(cover()).toHaveFocus();
  });

  it('turns pages in single instantly too', () => {
    const { container } = render(<JournalBook items={items} layout="single" />);
    fireEvent.click(cover());
    fireEvent.click(next());
    expect(container.querySelector('.book-turn')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Segunda página de Hades' })).toBeInTheDocument();
  });
});
