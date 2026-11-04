import { render, screen, within } from '@testing-library/react';
import { CategoryRatings } from './CategoryRatings';

const row = (label: string) => screen.getByText(label).parentElement!;

describe('CategoryRatings', () => {
  it('shows the four categories with their rating when complete', () => {
    render(<CategoryRatings ratings={{ gameplay: 5, story: 4, music: 3, graphics: 1 }} />);
    expect(within(row('Gameplay')).getByRole('img', { name: '5 de 5 estrellas' })).toBeVisible();
    expect(within(row('Historia')).getByRole('img', { name: '4 de 5 estrellas' })).toBeVisible();
    expect(within(row('Música')).getByRole('img', { name: '3 de 5 estrellas' })).toBeVisible();
    expect(within(row('Gráficos')).getByRole('img', { name: '1 de 5 estrellas' })).toBeVisible();
    expect(screen.queryByText('Sin calificar')).not.toBeInTheDocument();
  });

  it('marks only the missing categories as unrated when partial', () => {
    render(<CategoryRatings ratings={{ gameplay: 5, music: 5 }} />);
    expect(within(row('Gameplay')).getByRole('img')).toBeInTheDocument();
    expect(within(row('Música')).getByRole('img')).toBeInTheDocument();
    expect(within(row('Historia')).getByText('Sin calificar')).toBeInTheDocument();
    expect(within(row('Gráficos')).getByText('Sin calificar')).toBeInTheDocument();
  });

  it('marks every category as unrated when there are no ratings', () => {
    render(<CategoryRatings />);
    expect(screen.getAllByText('Sin calificar')).toHaveLength(4);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('lists the categories in a fixed order', () => {
    render(<CategoryRatings ratings={{ graphics: 2 }} />);
    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
      'Gameplay',
      'Historia',
      'Música',
      'Gráficos',
    ]);
  });
});
