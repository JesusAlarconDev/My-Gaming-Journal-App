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

  it('shows five gray outlined stars and "Sin valoración" without a rating', () => {
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

  it('does not rely on color alone: rated stars are filled, unrated ones have no fill', () => {
    const { container } = render(<HandDrawnStars value={2} />);
    const [rated, unrated] = [stars(container)[0]!, stars(container)[4]!];
    expect(rated.querySelector('path')).toHaveClass('fill-gold');
    expect(unrated.querySelector('path')).toHaveClass('fill-none');
  });

  it('places the stars alternately high and low, left to right', () => {
    const { container } = render(<HandDrawnStars value={5} />);
    const ys = stars(container).map(translateY);
    const baseline = 20;
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
