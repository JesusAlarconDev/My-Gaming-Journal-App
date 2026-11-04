import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

async function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  // Wait for the header greeting (async user load) so no state updates land after the test.
  await screen.findByText('Hola, Alex');
  return router;
}

const navs = () => screen.getAllByRole('navigation', { name: 'Navegación principal' });

describe('routing', () => {
  it.each([
    ['/', 'Inicio'],
    ['/journal', 'Diario'],
    ['/collection', 'Mi colección'],
    ['/profile', 'Mi perfil'],
  ])('renders %s with a single h1 "%s"', async (path, title) => {
    await renderAt(path);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(document.title).toBe(`${title} · Game Journal`);
  });

  it('renders a 404 view with a link home for unknown routes', async () => {
    await renderAt('/nope');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Página no encontrada' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  });
});

describe('navigation', () => {
  it('links to the four sections in both navs', async () => {
    await renderAt('/');
    for (const nav of navs()) {
      const hrefs = within(nav)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href'));
      expect(hrefs).toEqual(['/', '/journal', '/collection', '/profile']);
    }
  });

  it('marks only the active section with aria-current="page"', async () => {
    await renderAt('/journal');
    for (const nav of navs()) {
      const current = within(nav)
        .getAllByRole('link')
        .filter((a) => a.getAttribute('aria-current') === 'page');
      expect(current.map((a) => a.textContent)).toEqual(['Diario']);
    }
  });

  it('does not mark Inicio as active on other routes', async () => {
    await renderAt('/profile');
    for (const nav of navs()) {
      expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current');
    }
  });

  it('navigates client-side and updates the active item and focus', async () => {
    const router = await renderAt('/');
    const nav = navs()[0]!;
    fireEvent.click(within(nav).getByRole('link', { name: 'Mi colección' }));
    expect(router.state.location.pathname).toBe('/collection');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Mi colección' }),
    ).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Mi colección' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('main')).toHaveFocus();
  });
});

describe('layout accessibility', () => {
  it('has banner and main landmarks and a skip link to #main', async () => {
    await renderAt('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main');
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveAttribute(
      'href',
      '#main',
    );
  });
});
