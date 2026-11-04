import { render, screen } from '@testing-library/react';
import { CaptureFrame } from './CaptureFrame';

describe('CaptureFrame', () => {
  it('shows the screenshot with descriptive alt text', () => {
    render(<CaptureFrame n={2} gameTitle="Hades" src="/shot.png" />);
    const image = screen.getByRole('img', { name: 'Captura 2 de Hades' });
    expect(image).toHaveAttribute('src', '/shot.png');
  });

  it('shows a decorative placeholder without an image', () => {
    const { container } = render(<CaptureFrame n={1} gameTitle="Hades" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('keeps a very long game title in the alt text', () => {
    const title = 'A'.repeat(200);
    render(<CaptureFrame n={3} gameTitle={title} src="/x.png" />);
    expect(screen.getByRole('img', { name: `Captura 3 de ${title}` })).toBeInTheDocument();
  });
});
