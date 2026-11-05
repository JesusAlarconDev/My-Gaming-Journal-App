import { act, render, screen } from '@testing-library/react';
import { BOOK_COMPACT_MAX_WIDTH, BOOK_SPREAD_MIN_WIDTH } from '@/lib/book';
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
  const [ref, layout, compact] = useBookLayout<HTMLDivElement>();
  return <div ref={ref} data-testid="container" data-layout={layout} data-compact={compact} />;
}

const layout = () => screen.getByTestId('container').dataset.layout;
const compact = () => screen.getByTestId('container').dataset.compact;

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

  describe('compact (one capture at a time)', () => {
    it('is compact at 550 px and not at 551 px, on mount', () => {
      measuredWidth(BOOK_COMPACT_MAX_WIDTH);
      const first = render(<Probe />);
      expect(compact()).toBe('true');
      first.unmount();

      measuredWidth(BOOK_COMPACT_MAX_WIDTH + 1);
      render(<Probe />);
      expect(compact()).toBe('false');
    });

    it('follows the container width when it is resized, without touching the layout rule', () => {
      measuredWidth(800);
      render(<Probe />);
      expect([layout(), compact()]).toEqual(['spread', 'false']);
      resizeTo(600);
      expect([layout(), compact()]).toEqual(['single', 'false']);
      resizeTo(550);
      expect([layout(), compact()]).toEqual(['single', 'true']);
      resizeTo(360);
      expect([layout(), compact()]).toEqual(['single', 'true']);
      resizeTo(551);
      expect([layout(), compact()]).toEqual(['single', 'false']);
    });
  });
});
