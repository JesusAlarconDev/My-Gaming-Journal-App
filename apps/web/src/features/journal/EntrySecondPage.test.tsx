import { render, screen, within } from '@testing-library/react';
import { GAME_STATUSES } from '@game-journal/contracts';
import { t } from '@/lib/i18n';
import { EntrySecondPage } from './EntrySecondPage';
import { COMPLETE_ENTRY, makeItem } from './testItems';

describe('EntrySecondPage', () => {
  it('shows every section of a complete entry', () => {
    render(<EntrySecondPage item={makeItem(COMPLETE_ENTRY)} />);
    expect(screen.getByRole('heading', { level: 3, name: '¿Qué te gustó?' })).toBeInTheDocument();
    expect(screen.getByText('La narrativa y el combate.')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: '¿Qué no te gustó?' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Algunas salas se repiten.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Calificaciones' })).toBeInTheDocument();
    expect(screen.getAllByRole('term')).toHaveLength(4);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Juegos que podrían gustarte' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Juego de ejemplo A',
      'Juego de ejemplo B',
      'Juego de ejemplo C',
    ]);
    expect(screen.getByText('Completado')).toBeInTheDocument();
  });

  it.each(GAME_STATUSES)('shows the %s status as text', (status) => {
    render(<EntrySecondPage item={makeItem({ status })} />);
    expect(screen.getByText(t(`status.${status}`))).toBeInTheDocument();
  });

  it('shows a help text for empty liked and disliked sections instead of leaving gaps', () => {
    render(<EntrySecondPage item={makeItem({ likedText: '', dislikedText: undefined })} />);
    expect(screen.getAllByText('Todavía no has escrito nada aquí.')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: '¿Qué te gustó?' })).toBeInTheDocument();
  });

  it('shows the help text only for the section that is empty', () => {
    render(<EntrySecondPage item={makeItem({ likedText: 'Mucho', dislikedText: '' })} />);
    expect(screen.getByText('Mucho')).toBeInTheDocument();
    expect(screen.getAllByText('Todavía no has escrito nada aquí.')).toHaveLength(1);
  });

  it('omits the suggestions section when there are none', () => {
    render(<EntrySecondPage item={makeItem()} />);
    expect(screen.queryByRole('heading', { name: /podrían gustarte/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('omits the suggestions section for an empty list', () => {
    render(<EntrySecondPage item={makeItem({ suggestedGames: [] })} />);
    expect(screen.queryByRole('heading', { name: /podrían gustarte/ })).not.toBeInTheDocument();
  });

  it('handles an entry with only game and status: no texts, categories or suggestions', () => {
    render(<EntrySecondPage item={makeItem({ status: 'backlog' })} />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getAllByText('Sin calificar')).toHaveLength(4);
    expect(screen.getAllByText('Todavía no has escrito nada aquí.')).toHaveLength(2);
  });

  it('shows partial category ratings next to the unrated ones', () => {
    render(<EntrySecondPage item={makeItem({ categoryRatings: { gameplay: 5, music: 5 } })} />);
    expect(screen.getAllByText('Sin calificar')).toHaveLength(2);
    expect(screen.getAllByRole('img', { name: '5 de 5 estrellas' })).toHaveLength(2);
  });

  it('keeps very long texts and suggestion titles in the DOM, on a page that scrolls', () => {
    const long = 'Muchísimo texto. '.repeat(150).trim();
    const longTitle = 'Un título de juego sugerido larguísimo '.repeat(8).trim();
    render(
      <EntrySecondPage
        item={makeItem({ likedText: long, dislikedText: long, suggestedGames: [longTitle] })}
      />,
    );
    expect(screen.getAllByText(long)).toHaveLength(2);
    expect(screen.getByText(longTitle)).toHaveClass('break-words');
    const page = screen.getByRole('region', { name: 'Segunda página de Hades' });
    expect(page).toHaveClass('overflow-y-auto');
    expect(page).toHaveAttribute('tabindex', '0');
  });

  it('groups each section under its own heading, in reading order', () => {
    render(<EntrySecondPage item={makeItem(COMPLETE_ENTRY)} />);
    const page = screen.getByRole('region', { name: 'Segunda página de Hades' });
    const headings = within(page).getAllByRole('heading');
    expect(headings.map((h) => h.textContent)).toEqual([
      '¿Qué te gustó?',
      '¿Qué no te gustó?',
      'Calificaciones',
      'Juegos que podrían gustarte',
    ]);
  });
});
