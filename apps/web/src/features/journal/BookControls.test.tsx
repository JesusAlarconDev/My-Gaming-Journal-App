import { fireEvent, render, screen } from '@testing-library/react';
import type { BookPosition } from '@/lib/book';
import { BookControls } from './BookControls';

const at = (entryIndex: number, side: BookPosition['side'] = 'first'): BookPosition => ({
  entryIndex,
  side,
});

function setup(position: BookPosition, layout: 'spread' | 'single', total = 6) {
  const onPrevious = vi.fn();
  const onNext = vi.fn();
  render(
    <BookControls
      position={position}
      layout={layout}
      total={total}
      onPrevious={onPrevious}
      onNext={onNext}
    />,
  );
  return { onPrevious, onNext };
}

describe('BookControls', () => {
  it('names the buttons after the entry in a spread and shows the entry position', () => {
    setup(at(1), 'spread');
    expect(screen.getByRole('button', { name: 'Entrada anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrada siguiente' })).toBeInTheDocument();
    expect(screen.getByText('Entrada 2 de 6')).toBeInTheDocument();
  });

  it('names the buttons after the page in single and shows entry and page', () => {
    setup(at(1, 'second'), 'single');
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toBeInTheDocument();
    expect(screen.getByText('Entrada 2 de 6 · Página 2 de 2')).toBeInTheDocument();
  });

  it('calls back when the buttons are used in the middle of the book', () => {
    const { onPrevious, onNext } = setup(at(2), 'spread');
    fireEvent.click(screen.getByRole('button', { name: 'Entrada siguiente' }));
    fireEvent.click(screen.getByRole('button', { name: 'Entrada anterior' }));
    expect(onNext).toHaveBeenCalledOnce();
    expect(onPrevious).toHaveBeenCalledOnce();
  });

  it('marks the previous button inactive on the first entry, but keeps it focusable', () => {
    const { onPrevious } = setup(at(0), 'spread');
    const previous = screen.getByRole('button', { name: 'Entrada anterior' });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Entrada siguiente' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
    fireEvent.click(previous);
    expect(onPrevious).not.toHaveBeenCalled();
  });

  it('marks the next button inactive on the last entry', () => {
    const { onNext } = setup(at(5), 'spread');
    const next = screen.getByRole('button', { name: 'Entrada siguiente' });
    expect(next).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(next);
    expect(onNext).not.toHaveBeenCalled();
  });

  it('in single, only the last page of the last entry disables next', () => {
    setup(at(5), 'single');
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });

  it('in single, the last page of the last entry disables next and the first page disables previous', () => {
    const { unmount } = render(
      <BookControls
        position={at(5, 'second')}
        layout="single"
        total={6}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    unmount();
    setup(at(0), 'single');
    expect(screen.getByRole('button', { name: 'Página anterior' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('with a single entry, both buttons are inactive in a spread', () => {
    setup(at(0), 'spread', 1);
    expect(screen.getByRole('button', { name: 'Entrada anterior' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Entrada siguiente' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('with no entries, both buttons are inactive and there is no position text', () => {
    setup(at(0), 'spread', 0);
    expect(screen.getByRole('button', { name: 'Entrada anterior' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Entrada siguiente' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.queryByText(/Entrada \d/)).not.toBeInTheDocument();
  });

  it('is a labelled group of native buttons', () => {
    setup(at(0), 'spread');
    const group = screen.getByRole('group', { name: 'Navegación del diario' });
    expect(group.querySelectorAll('button')).toHaveLength(2);
  });
});
