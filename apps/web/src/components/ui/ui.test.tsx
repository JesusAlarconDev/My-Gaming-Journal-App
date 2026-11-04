import { fireEvent, render, screen } from '@testing-library/react';
import { t } from '@/lib/i18n';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { PageHeader } from './PageHeader';
import { PolaroidCard } from './PolaroidCard';
import { RatingStars } from './RatingStars';
import { StatusBadge } from './StatusBadge';
import { Sticker } from '../decor/Sticker';

describe('Button', () => {
  it('defaults to type="button" and handles clicks', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);
    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('StatusBadge', () => {
  it.each(['playing', 'completed', 'backlog', 'abandoned', 'on_hold'] as const)(
    'shows a text label for %s',
    (status) => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(t(`status.${status}`))).toBeInTheDocument();
    },
  );
});

describe('RatingStars', () => {
  it('exposes the rating as an accessible label', () => {
    render(<RatingStars value={4} />);
    expect(screen.getByRole('img', { name: '4 de 5 estrellas' })).toBeInTheDocument();
  });

  it('handles a missing rating', () => {
    render(<RatingStars />);
    expect(screen.getByRole('img', { name: 'Sin valoración' })).toBeInTheDocument();
  });
});

describe('PolaroidCard', () => {
  it('renders a placeholder cover when there is no image', () => {
    render(<PolaroidCard title="Hades" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Hades' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the cover image with alt text when provided', () => {
    render(<PolaroidCard title="Hades" coverUrl="/hades.png" />);
    expect(screen.getByRole('img', { name: 'Portada de Hades' })).toBeInTheDocument();
  });

  it('renders without status, rating or subtitle', () => {
    render(<PolaroidCard title="Celeste" />);
    expect(screen.queryByRole('img', { name: /estrellas|valoración/ })).not.toBeInTheDocument();
  });

  it('shows status and rating when present, with a configurable heading level', () => {
    render(<PolaroidCard title="Hades" status="completed" rating={4} titleAs="h2" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Hades' })).toBeInTheDocument();
    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '4 de 5 estrellas' })).toBeInTheDocument();
  });

  it('keeps very long titles in the DOM (truncation is visual only)', () => {
    const long = 'A'.repeat(200);
    render(<PolaroidCard title={long} />);
    expect(screen.getByRole('heading', { name: long })).toBeInTheDocument();
  });
});

describe('PageHeader and EmptyState', () => {
  it('renders the page h1', () => {
    render(<PageHeader title="Mi diario" description="Tus recuerdos" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Mi diario' })).toBeInTheDocument();
    expect(screen.getByText('Tus recuerdos')).toBeInTheDocument();
  });

  it('renders an empty state with an action', () => {
    render(<EmptyState title="Nada por aquí" action={<Button>Empezar</Button>} />);
    expect(screen.getByText('Nada por aquí')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Empezar' })).toBeInTheDocument();
  });
});

describe('Sticker', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Sticker>★</Sticker>);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
