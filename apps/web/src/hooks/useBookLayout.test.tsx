import { act, render, screen } from '@testing-library/react';
import { BOOK_SPREAD_MIN_WIDTH } from '@/lib/book';
import { useBookLayout } from './useBookLayout';

type ResizeCallback = (entries: { contentRect: { width: number } }[]) => void;

let observers: { callback: ResizeCallback; disconnect: ReturnType<typeof vi.fn> }[] = [];

function stubResizeObserver() {
  observers = [];
  vi.stubGlobal(
    'ResizeObserver',
    class {
      disconnect = vi.fn();
      observe = vi.fn();
      constructor(callback: ResizeCallback) {
        observers.push({ callback, disconnect: this.disconnect });
      }
    },
  );
}

function resizeTo(width: number) {
  act(() => observers.forEach((o) => o.callback([{ contentRect: { width } }])));
}

function measuredWidth(width: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width,
  } as DOMRect);
}

function Probe() {
  const [ref, layout] = useBookLayout<HTMLDivElement>();
  return <div ref={ref} data-testid="container" data-layout={layout} />;
}

const layout = () => screen.getByTestId('container').dataset.layout;

beforeEach(stubResizeObserver);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useBookLayout', () => {
  it('uses the measured width on mount: wide → spread', () => {
    measuredWidth(BOOK_SPREAD_MIN_WIDTH);
    render(<Probe />);
    expect(layout()).toBe('spread');
  });

  it('uses the measured width on mount: narrow → single', () => {
    measuredWidth(BOOK_SPREAD_MIN_WIDTH - 1);
    render(<Probe />);
    expect(layout()).toBe('single');
  });

  it('switches layout when the container is resized', () => {
    measuredWidth(360);
    render(<Probe />);
    expect(layout()).toBe('single');
    resizeTo(1000);
    expect(layout()).toBe('spread');
    resizeTo(500);
    expect(layout()).toBe('single');
  });

  it('stops observing on unmount', () => {
    measuredWidth(360);
    const { unmount } = render(<Probe />);
    unmount();
    expect(observers[0]!.disconnect).toHaveBeenCalled();
  });

  it('works without ResizeObserver, using the initial measurement', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    measuredWidth(900);
    render(<Probe />);
    expect(layout()).toBe('spread');
  });
});
