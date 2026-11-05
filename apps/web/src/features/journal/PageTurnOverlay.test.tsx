import { act, fireEvent, render } from '@testing-library/react';
import { BOOK_ANIMATION_SAFETY_MS } from '@/lib/book';
import { CoverOpenOverlay } from './CoverOpenOverlay';
import { PageTurnOverlay } from './PageTurnOverlay';

afterEach(() => {
  vi.useRealTimers();
});

describe('PageTurnOverlay', () => {
  it('is a decorative, inert layer', () => {
    const { container } = render(
      <PageTurnOverlay direction="next" layout="spread" onDone={() => {}} />,
    );
    const overlay = container.firstElementChild!;
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).toHaveAttribute('inert');
    expect(overlay).toHaveTextContent('');
    expect(overlay.querySelectorAll('button, a, input, [tabindex]')).toHaveLength(0);
  });

  it('describes the direction and layout for the styles', () => {
    const { container } = render(
      <PageTurnOverlay direction="previous" layout="single" onDone={() => {}} />,
    );
    expect(container.firstElementChild).toHaveAttribute('data-direction', 'previous');
    expect(container.firstElementChild).toHaveAttribute('data-layout', 'single');
  });

  it('backs the facing page in a spread but not in single', () => {
    const spread = render(<PageTurnOverlay direction="next" layout="spread" onDone={() => {}} />);
    expect(spread.container.querySelector('.book-turn__backing')).toBeInTheDocument();
    spread.unmount();
    const single = render(<PageTurnOverlay direction="next" layout="single" onDone={() => {}} />);
    expect(single.container.querySelector('.book-turn__backing')).not.toBeInTheDocument();
  });

  it('calls onDone when the leaf finishes its animation', () => {
    const onDone = vi.fn();
    const { container } = render(
      <PageTurnOverlay direction="next" layout="spread" onDone={onDone} />,
    );
    fireEvent.animationEnd(container.querySelector('.book-turn__leaf')!);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('calls onDone after the safety timeout if animationend never arrives', () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<PageTurnOverlay direction="next" layout="spread" onDone={onDone} />);
    act(() => vi.advanceTimersByTime(BOOK_ANIMATION_SAFETY_MS - 1));
    expect(onDone).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('cancels the safety timer when it unmounts', () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    const { unmount } = render(
      <PageTurnOverlay direction="next" layout="spread" onDone={onDone} />,
    );
    unmount();
    act(() => vi.advanceTimersByTime(BOOK_ANIMATION_SAFETY_MS * 2));
    expect(onDone).not.toHaveBeenCalled();
  });
});

describe('CoverOpenOverlay', () => {
  const layer = (container: HTMLElement) => container.firstElementChild as HTMLElement;

  it('is a decorative, inert layer', () => {
    const { container } = render(
      <CoverOpenOverlay layout="spread" direction="open" onDone={() => {}} />,
    );
    expect(layer(container)).toHaveAttribute('aria-hidden', 'true');
    expect(layer(container)).toHaveAttribute('inert');
    expect(layer(container).querySelectorAll('button, a, input, [tabindex]')).toHaveLength(0);
  });

  it('draws the cover front, its inside and a blank page for the book to open onto', () => {
    const { container } = render(
      <CoverOpenOverlay layout="spread" direction="open" onDone={() => {}} />,
    );
    expect(container.querySelector('.book-open__front')).toHaveTextContent('My Gaming Journal');
    expect(container.querySelector('.book-open__back')).toBeInTheDocument();
    expect(container.querySelector('.book-open__stage')).toBeInTheDocument();
  });

  it('lays the inside of the cover on the left page in a spread, but not in single', () => {
    const spread = render(<CoverOpenOverlay layout="spread" direction="open" onDone={() => {}} />);
    expect(spread.container.querySelector('.book-open__mask')).toBeInTheDocument();
    spread.unmount();
    const single = render(<CoverOpenOverlay layout="single" direction="open" onDone={() => {}} />);
    expect(single.container.querySelector('.book-open__mask')).not.toBeInTheDocument();
  });

  it('describes the layout and direction for the styles', () => {
    const open = render(<CoverOpenOverlay layout="single" direction="open" onDone={() => {}} />);
    expect(layer(open.container)).toHaveAttribute('data-layout', 'single');
    expect(layer(open.container)).toHaveAttribute('data-direction', 'open');
    open.unmount();
    const close = render(<CoverOpenOverlay layout="spread" direction="close" onDone={() => {}} />);
    expect(layer(close.container)).toHaveAttribute('data-direction', 'close');
  });

  it('ends when its own animation ends', () => {
    const onDone = vi.fn();
    const { container } = render(
      <CoverOpenOverlay layout="spread" direction="open" onDone={onDone} />,
    );
    fireEvent.animationEnd(layer(container));
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('does not end when an animation of an inner part bubbles up', () => {
    const onDone = vi.fn();
    const { container } = render(
      <CoverOpenOverlay layout="spread" direction="open" onDone={onDone} />,
    );
    fireEvent.animationEnd(container.querySelector('.book-open__leaf')!);
    fireEvent.animationEnd(container.querySelector('.book-open__assembly')!);
    expect(onDone).not.toHaveBeenCalled();
  });

  it('also ends after the safety timeout', () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<CoverOpenOverlay layout="spread" direction="close" onDone={onDone} />);
    act(() => vi.advanceTimersByTime(BOOK_ANIMATION_SAFETY_MS));
    expect(onDone).toHaveBeenCalledOnce();
  });
});
