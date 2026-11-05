import { fireEvent, render, screen, within } from '@testing-library/react';
import { BookSpread } from './BookSpread';
import { COMPLETE_ENTRY, makeItem } from './testItems';

const item = makeItem(COMPLETE_ENTRY);

describe('BookSpread', () => {
  it('shows both pages of the entry side by side in spread', () => {
    const { container } = render(
      <BookSpread item={item} layout="spread" position={{ entryIndex: 0, side: 'first' }} />,
    );
    expect(screen.getByRole('region', { name: 'Primera página de Hades' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Segunda página de Hades' })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('book-sheet--spread');
  });

  it('ignores the side in spread: both pages show either way', () => {
    render(<BookSpread item={item} layout="spread" position={{ entryIndex: 0, side: 'second' }} />);
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  it('shows only the first page in single when the position is on the first side', () => {
    render(<BookSpread item={item} layout="single" position={{ entryIndex: 0, side: 'first' }} />);
    expect(screen.getByRole('region', { name: 'Primera página de Hades' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /Segunda página/ })).not.toBeInTheDocument();
  });

  it('shows only the second page in single, with the game name as a running head', () => {
    render(<BookSpread item={item} layout="single" position={{ entryIndex: 0, side: 'second' }} />);
    expect(screen.getByRole('region', { name: 'Segunda página de Hades' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /Primera página/ })).not.toBeInTheDocument();
    expect(screen.getByText('Hades')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('does not repeat the game name as a running head in spread', () => {
    render(<BookSpread item={item} layout="spread" position={{ entryIndex: 0, side: 'first' }} />);
    expect(screen.getAllByText('Hades')).toHaveLength(1);
  });

  it('hides the spine from assistive technology', () => {
    const { container } = render(
      <BookSpread item={item} layout="spread" position={{ entryIndex: 0, side: 'first' }} />,
    );
    expect(container.querySelector('.book-spine')).toHaveAttribute('aria-hidden', 'true');
  });

  describe('compact captures', () => {
    const withImages = makeItem({ ...COMPLETE_ENTRY, images: ['/a.png', '/b.png', '/c.png'] });
    const first = { entryIndex: 0, side: 'first' } as const;

    it('passes the flag to the first page: one capture with controls instead of three', () => {
      render(<BookSpread item={withImages} layout="single" position={first} compactCaptures />);
      expect(screen.getByText('Captura 1 de 3')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Captura siguiente' })).toBeInTheDocument();
    });

    it('shows three captures in a row when the flag is off', () => {
      render(<BookSpread item={withImages} layout="single" position={first} />);
      expect(screen.queryByText(/Captura \d de 3/)).not.toBeInTheDocument();
      const group = screen.getByRole('group', { name: 'Capturas' });
      expect(within(group).getAllByRole('img')).toHaveLength(3);
    });

    it('restarts on the first capture when another entry is shown', () => {
      const other = makeItem(
        { ...COMPLETE_ENTRY, id: 'e2', images: ['/x.png', '/y.png', '/z.png'] },
        { id: 'g2', title: 'Celeste' },
      );
      const { rerender } = render(
        <BookSpread item={withImages} layout="single" position={first} compactCaptures />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Captura siguiente' }));
      expect(screen.getByText('Captura 2 de 3')).toBeInTheDocument();

      rerender(<BookSpread item={other} layout="single" position={first} compactCaptures />);
      expect(screen.getByText('Captura 1 de 3')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Captura 1 de Celeste' })).toBeInTheDocument();
    });
  });
});
