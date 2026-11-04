import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('mounts the app shell with its landmarks', async () => {
    render(<App />);
    expect(await screen.findByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getAllByRole('navigation', { name: 'Navegación principal' }).length,
    ).toBeGreaterThan(0);
    // Wait for the async greeting so no state updates land after the test.
    expect(await screen.findByText('Hola, Alex')).toBeInTheDocument();
  });
});
