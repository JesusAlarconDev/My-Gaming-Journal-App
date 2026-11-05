import { render, screen } from '@testing-library/react';
import type { Rating } from '@game-journal/contracts';
import { HandDrawnStars } from './HandDrawnStars';

const stars = (container: HTMLElement) => [...container.querySelectorAll('[data-star]')];
const filledCount = (container: HTMLElement) =>
  stars(container).filter((star) => star.getAttribute('data-filled') === 'true').length;
const translateY = (star: Element) =>
  Number(/translate\(\S+ (\S+)\)/.exec(star.getAttribute('transform') ?? '')![1]);

describe('HandDrawnStars', () => {
  it.each([1, 2, 3, 4, 5] as Rating[])('fills %i stars and announces it as text', (value) => {
    const { container } = render(<HandDrawnStars value={value} />);
    expect(stars(container)).toHaveLength(5);
    expect(filledCount(container)).toBe(value);
    expect(screen.getByRole('img', { name: `${value} de 5 estrellas` })).toBeInTheDocument();
  });

  it('shows five gray stars and "Sin valoración" without a rating', () => {
    const { container } = render(<HandDrawnStars />);
    expect(filledCount(container)).toBe(0);
    expect(screen.getByRole('img', { name: 'Sin valoración' })).toBeInTheDocument();
  });

  it('fills the first stars and leaves the rest as outlines', () => {
    const { container } = render(<HandDrawnStars value={3} />);
    expect(stars(container).map((s) => s.getAttribute('data-filled'))).toEqual([
      'true',
      'true',
      'true',
      'false',
      'false',
    ]);
  });

  it('draws solid stickers: gold with a white border if rated, flat light gray all over if not', () => {
    const { container } = render(<HandDrawnStars value={2} />);
    const [rated, unrated] = [stars(container)[0]!, stars(container)[4]!];
    expect(rated.querySelector('path')).toHaveClass('fill-gold', 'stroke-white');
    expect(unrated.querySelector('path')).toHaveClass('fill-star-off', 'stroke-star-off');
    expect(unrated.querySelector('path')).not.toHaveClass('fill-none');
    expect(unrated.querySelector('path')).toHaveAttribute('paint-order', 'stroke');
  });

  it('places the stars alternately high and low, left to right', () => {
    const { container } = render(<HandDrawnStars value={5} />);
    const ys = stars(container).map(translateY);
    const baseline = 24;
    expect(ys[0]).toBeLessThan(baseline);
    expect(ys[1]).toBeGreaterThan(baseline);
    expect(ys[2]).toBeLessThan(baseline);
    expect(ys[3]).toBeGreaterThan(baseline);
    expect(ys[4]).toBeLessThan(baseline);
  });

  it('draws the same stars on every render', () => {
    const first = render(<HandDrawnStars value={4} />).container.innerHTML;
    const second = render(<HandDrawnStars value={4} />).container.innerHTML;
    expect(second).toBe(first);
  });
});
