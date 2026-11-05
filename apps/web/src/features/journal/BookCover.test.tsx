import { fireEvent, render, screen } from '@testing-library/react';
import { BookCover } from './BookCover';

describe('BookCover', () => {
  it('is a single button named after the title and the open action', () => {
    render(<BookCover onOpen={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    const cover = screen.getByRole('button', { name: /Abrir el diario/ });
    expect(cover).toHaveAccessibleName('My Gaming Journal Abrir el diario');
    expect(cover).toHaveAttribute('type', 'button');
  });

  it('shows the fixed title and no user name', () => {
    render(<BookCover onOpen={() => {}} />);
    expect(screen.getByText('My Gaming Journal')).toBeInTheDocument();
    expect(screen.queryByText(/Diario de/)).not.toBeInTheDocument();
  });

  it('puts the open action in a tab inside the cover button', () => {
    const { container } = render(<BookCover onOpen={() => {}} />);
    const tab = container.querySelector('.book-cover__tab');
    expect(tab).toHaveTextContent('Abrir el diario');
    expect(screen.getByRole('button').contains(tab)).toBe(true);
  });

  it('opens on click anywhere on the cover, including its tab', () => {
    const onOpen = vi.fn();
    const { container } = render(<BookCover onOpen={onOpen} />);
    fireEvent.click(screen.getByText('My Gaming Journal'));
    fireEvent.click(container.querySelector('.book-cover__tab')!);
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it('is a native button, so Enter and Space activate it', () => {
    // Browsers turn Enter/Space on a focused <button> into a click.
    render(<BookCover onOpen={() => {}} />);
    const cover = screen.getByRole('button');
    expect(cover.tagName).toBe('BUTTON');
    expect(cover).not.toHaveAttribute('tabindex', '-1');
    cover.focus();
    expect(cover).toHaveFocus();
  });

  it('hides the decorative stitching and the tab arrow from assistive technology', () => {
    const { container } = render(<BookCover onOpen={() => {}} />);
    expect(container.querySelector('.book-cover__stitch')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.book-cover__tab svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
