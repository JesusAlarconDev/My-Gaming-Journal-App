import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CaptureCarousel } from './CaptureCarousel';

const THREE = ['/a.png', '/b.png', '/c.png'];

function Harness({ images, start = 0 }: { images: string[]; start?: number }) {
  const [index, setIndex] = useState(start);
  return (
    <CaptureCarousel images={images} gameTitle="Hades" index={index} onIndexChange={setIndex} />
  );
}

const next = () => screen.getByRole('button', { name: 'Captura siguiente' });
const previous = () => screen.getByRole('button', { name: 'Captura anterior' });
const indicator = () => screen.getByText(/^Captura \d de 3$/);

describe('CaptureCarousel', () => {
  it('shows a single capture at a time, starting with the first', () => {
    render(<Harness images={THREE} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', '/a.png');
    expect(images[0]).toHaveAccessibleName('Captura 1 de Hades');
    expect(indicator()).toHaveTextContent('Captura 1 de 3');
  });

  it('moves between the three captures with the right and left buttons', () => {
    render(<Harness images={THREE} />);
    fireEvent.click(next());
    expect(screen.getByRole('img')).toHaveAttribute('src', '/b.png');
    expect(indicator()).toHaveTextContent('Captura 2 de 3');
    fireEvent.click(next());
    expect(screen.getByRole('img')).toHaveAttribute('src', '/c.png');
    fireEvent.click(previous());
    expect(screen.getByRole('img')).toHaveAttribute('src', '/b.png');
  });

  it('disables the previous button on the first capture and the next one on the last', () => {
    render(<Harness images={THREE} />);
    expect(previous()).toHaveAttribute('aria-disabled', 'true');
    expect(next()).toHaveAttribute('aria-disabled', 'false');
    fireEvent.click(next());
    expect(previous()).toHaveAttribute('aria-disabled', 'false');
    fireEvent.click(next());
    expect(next()).toHaveAttribute('aria-disabled', 'true');
    expect(previous()).toHaveAttribute('aria-disabled', 'false');
  });

  it('does not move or wrap around past the ends, and keeps the buttons focusable', () => {
    render(<Harness images={THREE} />);
    fireEvent.click(previous());
    expect(indicator()).toHaveTextContent('Captura 1 de 3');
    expect(previous()).not.toBeDisabled();
    fireEvent.click(next());
    fireEvent.click(next());
    fireEvent.click(next());
    fireEvent.click(next());
    expect(indicator()).toHaveTextContent('Captura 3 de 3');
    expect(screen.getByRole('img')).toHaveAttribute('src', '/c.png');
  });

  it('handles repeated quick clicks one step at a time', () => {
    render(<Harness images={THREE} />);
    for (let i = 0; i < 10; i++) fireEvent.click(next());
    expect(indicator()).toHaveTextContent('Captura 3 de 3');
    for (let i = 0; i < 10; i++) fireEvent.click(previous());
    expect(indicator()).toHaveTextContent('Captura 1 de 3');
  });

  it('announces the position through a polite live region', () => {
    render(<Harness images={THREE} />);
    expect(indicator()).toHaveAttribute('aria-live', 'polite');
  });

  it('keeps three positions with 1 image: the missing ones are decorative placeholders', () => {
    render(<Harness images={['/a.png']} />);
    expect(screen.getAllByRole('img')).toHaveLength(1);
    fireEvent.click(next());
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(indicator()).toHaveTextContent('Captura 2 de 3');
    fireEvent.click(next());
    expect(indicator()).toHaveTextContent('Captura 3 de 3');
  });

  it('keeps three positions with 2 images', () => {
    render(<Harness images={['/a.png', '/b.png']} start={1} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/b.png');
    fireEvent.click(next());
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('only walks through the first three of more than three images', () => {
    render(<Harness images={[...THREE, '/d.png', '/e.png']} />);
    fireEvent.click(next());
    fireEvent.click(next());
    fireEvent.click(next());
    expect(screen.getByRole('img')).toHaveAttribute('src', '/c.png');
    expect(indicator()).toHaveTextContent('Captura 3 de 3');
  });

  it('shows one empty frame without buttons or indicator when there are no captures', () => {
    const { container } = render(<Harness images={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText(/Captura \d de 3/)).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelectorAll('div[aria-hidden="true"]')).toHaveLength(1);
  });

  it('keeps the empty frame as wide as the frame between the arrows', () => {
    const empty = render(<Harness images={[]} />);
    const emptyRow = screen.getByRole('group').firstElementChild!;
    expect([...emptyRow.children].map((child) => child.className)).toEqual([
      'w-11 shrink-0',
      expect.stringContaining('flex-1'),
      'w-11 shrink-0',
    ]);
    empty.unmount();

    render(<Harness images={THREE} />);
    const row = screen.getByRole('group').firstElementChild!;
    const frameClass = (el: Element) => (el.children[1] as HTMLElement).className;
    expect(frameClass(row)).toContain('flex-1');
    expect(row.children).toHaveLength(3);
  });

  it('tells the parent which capture to show instead of keeping its own state', () => {
    const onIndexChange = vi.fn();
    render(
      <CaptureCarousel images={THREE} gameTitle="Hades" index={1} onIndexChange={onIndexChange} />,
    );
    fireEvent.click(next());
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
    fireEvent.click(previous());
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it('does not call back when a disabled button is pressed', () => {
    const onIndexChange = vi.fn();
    render(
      <CaptureCarousel images={THREE} gameTitle="Hades" index={0} onIndexChange={onIndexChange} />,
    );
    fireEvent.click(previous());
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it('is operable with the keyboard through native buttons', () => {
    render(<Harness images={THREE} />);
    expect(next().tagName).toBe('BUTTON');
    expect(previous().tagName).toBe('BUTTON');
    next().focus();
    expect(next()).toHaveFocus();
  });
});
