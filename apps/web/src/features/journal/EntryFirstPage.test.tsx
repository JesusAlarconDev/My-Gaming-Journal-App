import { render, screen, within } from '@testing-library/react';
import { EntryFirstPage } from './EntryFirstPage';
import { COMPLETE_ENTRY, makeItem } from './testItems';

describe('EntryFirstPage', () => {
  it('shows the name, cover, three captures, rating and text of a complete entry', () => {
    render(<EntryFirstPage item={makeItem(COMPLETE_ENTRY)} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Hades' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '4 de 5 estrellas' })).toBeInTheDocument();
    expect(screen.getByText('Morir nunca se sintió tan bien.')).toBeInTheDocument();
    const captures = screen.getByRole('group', { name: 'Capturas' });
    expect(captures.children).toHaveLength(3);
  });

  it('uses the cover image when the game has one, with alt text', () => {
    render(<EntryFirstPage item={makeItem({}, { coverUrl: '/hades.png' })} />);
    expect(screen.getByRole('img', { name: 'Portada de Hades' })).toHaveAttribute(
      'src',
      '/hades.png',
    );
  });

  it('falls back to a generated cover without an image', () => {
    render(<EntryFirstPage item={makeItem()} />);
    expect(screen.queryByRole('img', { name: /Portada/ })).not.toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
  });

  describe('captures', () => {
    const captures = () => screen.getByRole('group', { name: 'Capturas' });

    it('keeps three frames when there are no images', () => {
      render(<EntryFirstPage item={makeItem()} />);
      expect(captures().children).toHaveLength(3);
      expect(within(captures()).queryByRole('img')).not.toBeInTheDocument();
    });

    it('fills only the available frames with 1 image', () => {
      render(<EntryFirstPage item={makeItem({ images: ['/a.png'] })} />);
      expect(captures().children).toHaveLength(3);
      expect(within(captures()).getAllByRole('img')).toHaveLength(1);
    });

    it('shows the 3 images when there are exactly 3', () => {
      render(<EntryFirstPage item={makeItem({ images: ['/a.png', '/b.png', '/c.png'] })} />);
      expect(within(captures()).getAllByRole('img')).toHaveLength(3);
    });

    it('shows only the first 3 when there are more', () => {
      const images = ['/a.png', '/b.png', '/c.png', '/d.png', '/e.png'];
      render(<EntryFirstPage item={makeItem({ images })} />);
      const shown = within(captures()).getAllByRole('img');
      expect(shown.map((img) => img.getAttribute('src'))).toEqual(['/a.png', '/b.png', '/c.png']);
    });
  });

  it('handles a minimal entry: no rating, no review, no images', () => {
    render(<EntryFirstPage item={makeItem()} />);
    expect(screen.getByRole('img', { name: 'Sin valoración' })).toBeInTheDocument();
    expect(screen.getByText('Sin reseña todavía')).toBeInTheDocument();
  });

  it('keeps a very long title in the page and lets it wrap', () => {
    const title = 'Título larguísimo '.repeat(20).trim();
    render(<EntryFirstPage item={makeItem({}, { title })} />);
    const heading = screen.getByRole('heading', { level: 2, name: title });
    expect(heading).toHaveClass('break-words');
  });

  it('keeps a very long review fully in the DOM, on a page that scrolls and can be focused', () => {
    const review = 'Una reseña muy larga. '.repeat(200).trim();
    render(<EntryFirstPage item={makeItem({ review })} />);
    expect(screen.getByText(review)).toBeInTheDocument();
    const page = screen.getByRole('region', { name: 'Primera página de Hades' });
    expect(page).toHaveClass('overflow-y-auto');
    expect(page).toHaveAttribute('tabindex', '0');
  });

  it('preserves line breaks written by the player', () => {
    render(<EntryFirstPage item={makeItem({ review: 'Línea 1\nLínea 2' })} />);
    expect(screen.getByText(/Línea 1/)).toHaveClass('whitespace-pre-line');
  });
});
