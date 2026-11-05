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
  it('is a decorative, inert layer that ends with its animation', () => {
    const onDone = vi.fn();
    const { container } = render(<CoverOpenOverlay onDone={onDone} />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).toHaveAttribute('inert');
    fireEvent.animationEnd(container.querySelector('.book-turn__leather')!);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('also ends after the safety timeout', () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<CoverOpenOverlay onDone={onDone} />);
    act(() => vi.advanceTimersByTime(BOOK_ANIMATION_SAFETY_MS));
    expect(onDone).toHaveBeenCalledOnce();
  });
});
